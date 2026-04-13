import prisma from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/admin'

/**
 * GET /api/admin/users
 * Fetch all users with optional role filtering
 */
export default defineEventHandler(async (event) => {
  // Verify admin access
  requireAdmin(event)

  try {
    // Get query parameters for filtering
    const query = getQuery(event)
    const role = query.role as string

    // Build where clause based on role filter
    const where: any = {}
    if (role && role !== 'ALL') {
      where.role = role
    }

    // Fetch all users with their order count
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            orders: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      success: true,
      users,
      total: users.length
    }
  } catch (error: any) {
    console.error('[Fetch Users Error]:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch users'
    })
  }
})
