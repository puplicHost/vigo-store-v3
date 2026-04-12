import prisma from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/admin'

/**
 * GET /api/admin/orders/:id
 * Get a single order by ID with orderItems and user data
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

    // Fetch order with items (including products) and user
    const order = await prisma.order.findUnique({
      where: { id },
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

    if (!order) {
      throw createError({
        statusCode: 404,
        message: 'Order not found'
      })
    }

    return order
  } catch (error: any) {
    // Pass through known errors
    if (error.statusCode === 401 || error.statusCode === 403 || error.statusCode === 404) {
      throw error
    }

    console.error('[Order Detail Error]:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch order'
    })
  }
})
