import prisma from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/admin'

export default defineEventHandler(async (event) => {
  try {
    // Verify admin access
    requireAdmin(event)

    // Fetch all categories
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })

    return {
      success: true,
      data: categories
    }
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
