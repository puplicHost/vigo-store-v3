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

    // Check if category has products
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: { take: 1 } }
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
        statusMessage: 'Cannot delete category with existing products'
      })
    }

    // Delete category
    await prisma.category.delete({
      where: { id }
    })

    return {
      success: true,
      message: 'Category deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('[Category DELETE Error]', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete category'
    })
  }
})
