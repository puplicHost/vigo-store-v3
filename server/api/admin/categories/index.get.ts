import prisma from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/admin'

export default defineEventHandler(async (event) => {
  try {
    // Verify admin access
    requireAdmin(event)

    // Fetch all categories with product count
    const categories = await prisma.category.findMany({
      include: {
        products: {
          select: { id: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    return categories
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('[Categories GET Error]', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch categories'
    })
  }
})
