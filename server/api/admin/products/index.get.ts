import prisma from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/admin'
import { handleError } from '../../../utils/error'

export default defineEventHandler(async (event) => {
  try {
    // Verify admin access
    requireAdmin(event)

    // Get filter and pagination parameters
    const query = getQuery(event)
    const showArchived = query.showArchived === 'true'
    const page = Math.max(parseInt(query.page as string) || 1, 1)
    const limit = Math.min(Math.max(parseInt(query.limit as string) || 20, 1), 100)
    const skip = (page - 1) * limit

    // Build filters dynamically for safety
    const where: any = {}
    
    // Only show non-deleted products unless archived is requested
    if (!showArchived) {
      where.isDeleted = false
    }

    // Fetch products
    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: skip
    })

    // Return standardized format
    return {
      success: true,
      items: products
    }
  } catch (error: any) {
    throw handleError(error)
  }
})
