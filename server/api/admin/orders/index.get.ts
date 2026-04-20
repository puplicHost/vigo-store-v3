import prisma from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/admin'
import { handleError } from '../../../utils/error'

/**
 * GET /api/admin/orders
 * Production-grade read-only endpoint for order archival management.
 * Strictly decoupled from payment services.
 */
export default defineEventHandler(async (event) => {
  try {
    requireAdmin(event)

    const query = getQuery(event)
    const page = Math.max(parseInt(query.page as string) || 1, 1)
    const limit = Math.min(Math.max(parseInt(query.limit as string) || 20, 1), 100)
    const skip = (page - 1) * limit
    const search = query.search as string
    const status = query.status as string

    // 1. Build strict predicate
    const where: any = {}
    if (status) {
      where.status = status
    }
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ]
    }

    // 2. Safe Prisma Query Execution
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          items: {
            include: {
              product: {
                select: { id: true, name: true, slug: true, images: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ])

    return {
      success: true,
      items: orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }

  } catch (error: any) {
    // Phase 3 & 6: Standardized global error masking
    console.error('[ADMIN ORDERS ARCHIVE FATAL]', error)
    throw handleError(error)
  }
})
