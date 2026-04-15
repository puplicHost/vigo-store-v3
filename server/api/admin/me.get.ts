import prisma from '../../utils/prisma'
import { requireAdmin } from '../../utils/admin'
import { getUserPermissions } from '../../utils/permissions'

export default defineEventHandler(async (event) => {
  try {
    // Verify admin access
    requireAdmin(event)

    // Get user from auth middleware
    const user = event.context.user

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    // Fetch user with orders count
    const userWithOrders = await prisma.user.findUnique({
      where: { id: user.userId },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    })

    if (!userWithOrders) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Get permissions based on role
    const permissions = getUserPermissions(userWithOrders.role)

    return {
      id: userWithOrders.id,
      name: userWithOrders.name,
      email: userWithOrders.email,
      role: userWithOrders.role,
      image: userWithOrders.image,
      permissions,
      ordersCount: userWithOrders._count.orders,
      createdAt: userWithOrders.createdAt
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('[Admin Me Error]', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch user data'
    })
  }
})
