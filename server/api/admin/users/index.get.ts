import prisma from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/admin'
import { logger } from '../../../utils/logger'

/**
 * GET /api/admin/users
 * Fetch all users with optional role filtering
 */
export default defineEventHandler(async (event) => {
  // Verify admin access
  requireAdmin(event)

  try {
    // Get pagination parameters with safety bounds
    const query = getQuery(event)
    const page = Math.max(parseInt(query.page as string) || 1, 1)
    const limit = Math.min(Math.max(parseInt(query.limit as string) || 20, 1), 100)
    const skip = (page - 1) * limit
    const role = query.role as string

    // Build where clause based on role filter
    const where: any = {}
    if (role && role !== 'ALL') {
      where.role = role
    }

    // Fetch paginated users + accurate total count
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        take: limit,
        skip,
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
      }),
      prisma.user.count({ where })
    ])

    return {
      success: true,
      items: users,
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  } catch (error: any) {
    logger.error('[Users GET Error]', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch users'
    })
  }
})
