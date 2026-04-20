import prisma from '../../utils/prisma'
import { logger } from '../../utils/logger'

/**
 * Paymob Redirect Callback
 * Paymob redirects here after a transaction attempt
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  // Paymob sends transaction details in query params
  const {
    success,
    id: transactionId,
    order: paymobOrderId,
    merchant_order_id: orderId,
    amount_cents,
    currency
  } = query

  logger.info(`[Paymob Callback] Order: ${orderId}, Success: ${success}, Transaction: ${transactionId}`)

  if (!orderId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing merchant_order_id'
    })
  }

  const isSuccess = success === 'true'

  try {
    // Update order status in database
    await prisma.order.update({
      where: { id: orderId as string },
      data: {
        paymentStatus: isSuccess ? 'PAID' : 'FAILED',
        transactionId: transactionId as string,
        status: isSuccess ? 'CONFIRMED' : 'PENDING'
      }
    })

    // Redirect user to a success or failure page on the frontend
    if (isSuccess) {
      return sendRedirect(event, `/checkout/success?orderId=${orderId}`)
    } else {
      return sendRedirect(event, `/checkout/error?orderId=${orderId}&reason=payment_failed`)
    }

  } catch (error: any) {
    logger.error('[Paymob Callback Error]', error)
    return sendRedirect(event, `/checkout/error?reason=internal_error`)
  }
})
