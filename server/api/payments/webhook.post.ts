import crypto from 'crypto'
import { PaymentStatus } from '@prisma/client'
import prisma from '../../utils/prisma'

/**
 * Paymob Webhook Handler (Idempotent & Secure)
 * Updates ONLY the PaymentStatus layer.
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const query = getQuery(event)
    
    // 1. Transaction Signal Check
    const { type, obj } = body
    if (type !== 'TRANSACTION') {
      return { success: true }
    }

    // 2. Fetch HMAC Secret (Conf Hierarchy)
    const gateway = await prisma.paymentGateway.findUnique({
      where: { name: 'PAYMOB' }
    })
    const hmacSecret = (gateway?.config as any)?.hmacSecret
    
    if (!hmacSecret) {
      console.error('[WEBHOOK ERROR] HMAC Secret missing in settlement config.')
      throw createError({ statusCode: 500, statusMessage: 'Gateway Configuration incomplete' })
    }

    // 3. HMAC Cryptographical Verification
    const hmac = query.hmac as string
    const data = obj
    
    const concatenatedString = 
      (data.amount_cents || '') +
      (data.created_at || '') +
      (data.currency || '') +
      (data.error_occured || 'false') +
      (data.has_parent_transaction || 'false') +
      (data.id || '') +
      (data.integration_id || '') +
      (data.is_3d_secure || 'false') +
      (data.is_auth || 'false') +
      (data.is_capture || 'false') +
      (data.is_refunded || 'false') +
      (data.is_standalone_payment || 'false') +
      (data.is_voided || 'false') +
      (data.order?.id || '') +
      (data.owner || '') +
      (data.pending || 'false') +
      (data.source_data?.pan || '') +
      (data.source_data?.sub_type || '') +
      (data.source_data?.type || '') +
      (data.success || 'false')

    const calculatedHmac = crypto
      .createHmac('sha512', hmacSecret)
      .update(concatenatedString)
      .digest('hex')

    if (calculatedHmac !== hmac) {
      console.warn('[WEBHOOK WARNING] HMAC Tampering detected. Unauthorized access attempt.')
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized HMAC Signal' })
    }

    // 4. Idempotency Guard (Prevent Double Processing)
    const externalId = String(data.id)
    const existingTx = await prisma.paymentTransaction.findUnique({
      where: { externalId }
    })

    if (existingTx) {
      console.log(`[WEBHOOK IDEMPOTENT] Signal for TX ${externalId} already processed. Ignoring.`)
      return { success: true, duplicated: true }
    }

    // 5. Atomic Settlement Update
    const orderId = data.order.merchant_order_id
    const success = data.success === true || data.success === 'true'

    await prisma.$transaction(async (tx) => {
      // Create Transaction Log
      await tx.paymentTransaction.create({
        data: {
          orderId: orderId,
          externalId,
          amount: data.amount_cents / 100,
          status: success ? 'SUCCESS' : 'FAILED',
          rawResponse: body
        }
      })

      // Update Order Payment Status ONLY
      await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: success ? PaymentStatus.PAID : PaymentStatus.FAILED,
          transactionId: externalId
        }
      })
    })

    console.log(`[WEBHOOK SETTLED] Order ${orderId} reconciled. Result: ${success ? 'PAID' : 'FAILED'}`)
    return { success: true }

  } catch (error: any) {
    console.error('[WEBHOOK FATAL ERROR]', error)
    // We return a 500 so the gateway knows it failed and might retry
    throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Internal Webhook Failure' })
  }
})
