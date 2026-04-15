import prisma from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/admin'

export default defineEventHandler(async (event) => {
  try {
    // Verify admin access
    requireAdmin(event)

    // Get category ID from route params
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category ID is required'
      })
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true }
    })

    if (!category) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }

    if (category.products.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot delete category with associated products'
      })
    }

    // Delete category
    await prisma.category.delete({
      where: { id }
    })

    return {
      success: true,
      message: `Category deleted successfully${category.products.length > 0 ? ` along with ${category.products.length} product(s)` : ''}`
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('[Category DELETE Error]', error.message, error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to delete category'
    })
  }
})
