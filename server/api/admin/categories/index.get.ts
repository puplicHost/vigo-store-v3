import prisma from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/admin'
import { logger } from '../../../utils/logger'

export default defineEventHandler(async (event) => {
  try {
    // Verify admin access
    requireAdmin(event)

    // Get pagination parameters with safety bounds
    const query = getQuery(event)
    const page = Math.max(parseInt(query.page as string) || 1, 1)
    const limit = Math.min(Math.max(parseInt(query.limit as string) || 20, 1), 100)
    const skip = (page - 1) * limit

    // Fetch categories with product count
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' },
      take: limit,
      skip: skip
    })

    return categories
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    logger.error('[Categories GET Error]', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch categories'
    })
  }
})
