import { requireAdmin } from '../../utils/admin'
import prisma from '../../utils/prisma'

/**
 * GET /api/admin/payments
 * Industrial-grade Reconciliation API with RBAC and detailed logs
 */
export default defineEventHandler(async (event) => {
  try {
    // 1. Mandatory Authority Check
    requireAdmin(event)

    const query = getQuery(event)
    
    // 2. Pagination Orchestration
    const page = Math.max(1, parseInt(query.page as string) || 1)
    const limit = Math.min(100, parseInt(query.limit as string) || 20)
    const skip = (page - 1) * limit

    const status = query.status as string
    const method = query.method as string
    const search = query.search as string

    // 3. Predicate Construction
    const where: any = {}
    
    if (status) where.paymentStatus = status
    if (method) where.paymentMethod = method.toUpperCase()
    
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { transactionId: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ]
    }

    // 4. Atomic Multi-fetch
    const [payments, total] = await Promise.all([
      prisma.order.findMany({
        where,
        take: limit,
        skip: skip,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 1 // Latest transaction attempt
          },
          items: {
            include: {
              product: { select: { name: true, images: true } }
            }
          }
        }
      }),
      prisma.order.count({ where })
    ])

    // 5. Data Normalization
    return {
      success: true,
      items: payments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }

  } catch (error: any) {
    console.error('[ADMIN PAYMENTS RECONCILIATION FATAL]', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to retrieve settlement data archive'
    })
  }
})
