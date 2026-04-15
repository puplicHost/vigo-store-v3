import prisma from '../../utils/prisma'
import { logger } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  try {
    // Get pagination parameters with safety bounds
    const query = getQuery(event)
    const page = Math.max(parseInt(query.page as string) || 1, 1)
    const limit = Math.min(Math.max(parseInt(query.limit as string) || 20, 1), 100)
    const skip = (page - 1) * limit

    // Fetch active, non-deleted products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          isDeleted: false,
          isActive: true
        },
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.product.count({
        where: {
          isDeleted: false,
          isActive: true
        }
      })
    ])

    return {
      items: products,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    }
  } catch (error: any) {
    logger.error('[Products GET Error]', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch products'
    })
  }
})
