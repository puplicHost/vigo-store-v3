import prisma from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/admin'
import { Prisma } from '@prisma/client'

/**
 * PATCH /api/admin/orders/:id
 * Update order status
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

    // Read request body
    const body = await readBody(event)
    const { status } = body

    // Validate status is provided
    if (!status) {
      throw createError({
        statusCode: 400,
        message: 'Status is required'
      })
    }

    // Validate status is a valid OrderStatus enum value
    const validStatuses = Object.values(Prisma.OrderStatus)
    if (!validStatuses.includes(status)) {
      throw createError({
        statusCode: 400,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      })
    }

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id }
    })

    if (!existingOrder) {
      throw createError({
        statusCode: 404,
        message: 'Order not found'
      })
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
                price: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return updatedOrder
  } catch (error: any) {
    // Pass through known errors
    if (error.statusCode === 400 || error.statusCode === 401 || error.statusCode === 403 || error.statusCode === 404) {
      throw error
    }

    console.error('[Update Order Status Error]:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update order status'
    })
  }
})
