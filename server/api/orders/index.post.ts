import { paymobService } from '../../utils/paymob'
import prisma from '../../utils/prisma'
import { handleError } from '../../utils/error'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  try {
    const body = await readBody(event)
    const { items, shippingAddress, totalAmount, paymentMethod } = body

    // 1. Validate Payment Method
    const gateway = await prisma.paymentGateway.findUnique({
      where: { name: paymentMethod.toUpperCase() }
    })

    if (!gateway || !gateway.isEnabled) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Selected payment method is currently unavailable'
      })
    }

    // 2. Validate Products Exist Before Order Creation
    const productIds = items.map((item: any) => item.productId)
    const validProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds }
      }
    })

    console.log("Incoming order items:", items)
    console.log("Validated product IDs:", validProducts)

    if (validProducts.length !== items.length) {
      throw createError({
        statusCode: 400,
        statusMessage: 'One or more products in your cart are unavailable'
      })
    }

    // 3. Create Order
    const userId = user.userId || user.id
    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid user session'
      })
    }

    const order = await prisma.order.create({
      data: {
        user: {
          connect: {
            id: userId
          }
        },
        totalAmount: Number(totalAmount),
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod: paymentMethod.toUpperCase(),
        shippingAddress: JSON.stringify(shippingAddress),
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    })

    // 3. Handle Paymob Logic
    if (paymentMethod.toUpperCase() === 'PAYMOB' && gateway.config) {
      const config = gateway.config as any

      const authToken = await paymobService.authenticate(config.apiKey)
      const amountCents = Math.round(totalAmount * 100)

      const paymobOrderId = await paymobService.registerOrder(
        authToken,
        amountCents,
        'EGP',
        order.id
      )

      const paymentToken = await paymobService.createPaymentKey(
        authToken,
        paymobOrderId,
        amountCents,
        'EGP',
        Number(config.integrationId),
        {
          first_name: shippingAddress.firstName || user.name || 'Vigo',
          last_name: shippingAddress.lastName || 'Customer',
          email: user.email,
          phone_number: shippingAddress.phone || '01000000000'
        }
      )

      return {
        success: true,
        orderId: order.id,
        paymentUrl: `https://egypt.paymob.com/api/acceptance/iframes/${config.iframeId}?payment_token=${paymentToken}`
      }
    }

    // 4. Handle COD Logic
    return {
      success: true,
      orderId: order.id,
      message: 'Order created successfully with Cash on Delivery'
    }

  } catch (error: any) {
    throw handleError(error)
  }
})
