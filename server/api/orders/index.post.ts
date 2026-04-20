import { OrderStatus, PaymentStatus } from '@prisma/client'
import { paymentService } from '../../utils/payment'
import prisma from '../../utils/prisma'
import { handleError } from '../../utils/error'

/**
 * POST /api/orders
 * Professional Order Creation Layer (Decoupled)
 */
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized session' })
  }

  try {
    const body = await readBody(event)
    const { items, shippingAddress, totalAmount, paymentMethod } = body

    // 1. Structural Validation
    if (!items || !items.length || !totalAmount || !paymentMethod) {
      throw createError({ statusCode: 400, statusMessage: 'Incomplete order payload' })
    }

    // 2. Gateway Availability Check
    const gateway = await prisma.paymentGateway.findUnique({
      where: { name: paymentMethod.toUpperCase() }
    })

    if (!gateway || !gateway.isEnabled) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: 'Selected settlement method is currently unavailable' 
      })
    }

    // 3. Product Integrity Check
    const productIds = items.map((item: any) => item.productId)
    const validProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, isDeleted: false, isActive: true }
    })

    if (validProducts.length !== items.length) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: 'One or more items in your cart are no longer available' 
      })
    }

    // 4. Create Order (Core Lifecycle: PENDING)
    const userId = user.userId || user.id
    const order = await prisma.order.create({
      data: {
        user: { connect: { id: userId } },
        totalAmount: Number(totalAmount),
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
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

    // 5. Initialize Settlement (Gateway Layer)
    const paymentResult = await paymentService.initializePayment(order, shippingAddress)

    if (!paymentResult.success) {
      // Logic: Order remains PENDING but we notify user of gateway failure
      throw createError({
        statusCode: 400,
        statusMessage: paymentResult.message || 'Settlement layer initialization failed'
      })
    }

    // 6. Response (Production Standard)
    return {
      success: true,
      orderId: order.id,
      paymentUrl: paymentResult.paymentUrl,
      message: paymentResult.message || 'Order intent recorded successfully'
    }

  } catch (error: any) {
    // Global Error Handling (Enterprise Layer)
    console.error('[ORDER CREATION FATAL]', error)
    throw handleError(error)
  }
})
