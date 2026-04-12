import prisma from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/admin'

/**
 * DELETE /api/admin/orders/:id
 * Delete an order by ID
 * Note: OrderItems will be cascade deleted due to Prisma relation
 */
export default defineEventHandler(async (event) => {
  try {
    // Verify admin access
    requireAdmin(event)

    // Get order ID from params
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Order ID is required'
      })
    }

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true
      }
    })

    if (!existingOrder) {
      throw createError({
        statusCode: 404,
        message: 'Order not found'
      })
    }

    // Delete order (orderItems will be cascade deleted if configured in Prisma)
    // If cascade is not set, manually delete orderItems first
    await prisma.$transaction(async (tx: any) => {
      // Delete order items first
      await tx.orderItem.deleteMany({
        where: { orderId: id }
      })

      // Delete the order
      await tx.order.delete({
        where: { id }
      })
    })

    return {
      success: true,
      message: 'Order deleted successfully',
      deletedOrderId: id
    }
  } catch (error: any) {
    // Pass through known errors
    if (error.statusCode === 401 || error.statusCode === 403 || error.statusCode === 404) {
      throw error
    }

    console.error('[Delete Order Error]:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete order'
    })
  }
})
