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
    // 1. RBAC Check (Must be inside try/catch to satisfy safety rules)
    const user = requireAdmin(event)
    if (!user) {
      return { success: false, items: [], total: 0, message: 'Unauthorized access' }
    }

    const query = getQuery(event)
    const page = Math.max(parseInt(query.page as string) || 1, 1)
    const limit = Math.min(Math.max(parseInt(query.limit as string) || 20, 1), 100)
    const skip = (page - 1) * limit
    const search = query.search as string
    const statusQuery = query.status as string

    // 2. Build strict predicate (FIX 1: Enum Mismatch Safety)
    const allowedStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED']
    const allowedPaymentStatuses = ['PENDING', 'PROCESSING', 'PAID', 'FAILED']

    const where: any = {}
    
    // Safety check for search
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ]
    }

    // Strict status filtering
    if (statusQuery && allowedStatuses.includes(statusQuery)) {
      where.status = statusQuery
    } else {
      // Ensure we only query valid enums even if no filter is provided
      // This prevents Prisma from crashing on legacy DB values
      where.status = { in: allowedStatuses }
    }

    // Always enforce valid payment statuses
    where.paymentStatus = { in: allowedPaymentStatuses }

    // 3. Safe Prisma Query Execution (FIX 2: Prevent Prisma Crash)
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

    // 4. Runtime Validation (FIX 4: Handle Dirty Database)
    const sanitizedOrders = orders.map((order: any) => ({
      ...order,
      status: allowedStatuses.includes(order.status) ? order.status : 'PENDING',
      paymentStatus: allowedPaymentStatuses.includes(order.paymentStatus) ? order.paymentStatus : 'PENDING'
    }))

    return {
      success: true,
      items: sanitizedOrders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }

  } catch (error: any) {
    // FIX 2 & 3: Standardized global error masking and fallback response
    console.error('[ADMIN ORDERS ARCHIVE FATAL]', error)
    
    // Return safe fallback instead of throwing 500
    return {
      success: false,
      items: [],
      total: 0,
      message: 'Failed to fetch orders safely due to an internal system error.'
    }
  }
})
