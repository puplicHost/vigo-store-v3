import { paymobService } from '../../utils/paymob'
import { settingsService } from '../../domains/settings/services/SettingsService'
import prisma from '../../utils/prisma'
import { logger } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  try {
    const user = event.context.user
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const body = await readBody(event)
    const { items, shippingAddress, totalAmount, paymentMethod } = body

    // 1. Get Settings for Payment Gateway Keys
    const settings = await settingsService.getSettings()

    // 2. Create Order in Database (Status: PENDING)
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: Number(totalAmount),
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod: paymentMethod.toUpperCase(),
        shippingAddress: JSON.stringify(shippingAddress), // Assuming we have as field or separate model
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    })

    // 3. Handle Payment Gateway Initialization
    if (paymentMethod.toUpperCase() === 'PAYMOB' && settings.isPaymobEnabled) {
      if (!settings.paymobApiKey || !settings.paymobIntegrationId) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Paymob is not configured properly'
        })
      }

      // Step A: Authentication
      const authToken = await paymobService.authenticate(settings.paymobApiKey)

      // Step B: Order Registration
      const amountCents = Math.round(totalAmount * 100)
      const paymobOrderId = await paymobService.registerOrder(
        authToken,
        amountCents,
        settings.currency || 'EGP',
        order.id
      )

      // Step C: Payment Key Generation
      const paymentToken = await paymobService.createPaymentKey(
        authToken,
        paymobOrderId,
        amountCents,
        settings.currency || 'EGP',
        Number(settings.paymobIntegrationId),
        {
          first_name: shippingAddress.firstName,
          last_name: shippingAddress.lastName,
          email: user.email,
          phone_number: shippingAddress.phone || '01000000000'
        }
      )

      return {
        success: true,
        orderId: order.id,
        paymentToken,
        iframeId: settings.paymobIframeId,
        paymentUrl: `https://egypt.paymob.com/api/acceptance/iframes/${settings.paymobIframeId}?payment_token=${paymentToken}`
      }
    }

    // Default response for COD or logic without redirect
    return {
      success: true,
      orderId: order.id,
      message: 'Order created successfully'
    }

  } catch (error: any) {
    logger.error('[Order Create Error]', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to create order'
    })
  }
})
