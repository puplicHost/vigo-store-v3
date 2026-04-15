import prisma from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/admin'
import { logger } from '../../../utils/logger'

export default defineEventHandler(async (event) => {
  try {
    requireAdmin(event)

    // Get pagination parameters with safety bounds
    const query = getQuery(event)
    const page = Math.max(parseInt(query.page as string) || 1, 1)
    const limit = Math.min(Math.max(parseInt(query.limit as string) || 20, 1), 100)
    const skip = (page - 1) * limit

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.order.count()
    ])

    return {
      items: orders,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    logger.error('[Orders GET Error]', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch orders'
    })
  }
})
