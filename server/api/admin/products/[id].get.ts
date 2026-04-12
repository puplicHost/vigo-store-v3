import prisma from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/admin'

/**
 * GET /api/admin/products/:id
 * Get a single product by ID with category relationship
 */
export default defineEventHandler(async (event) => {
  try {
    // Verify admin access
    requireAdmin(event)

    // Get product ID from params
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Product ID is required'
      })
    }

    // Fetch product with category
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!product) {
      throw createError({
        statusCode: 404,
        message: 'Product not found'
      })
    }

    return product
  } catch (error: any) {
    // Pass through known errors
    if (error.statusCode === 401 || error.statusCode === 403 || error.statusCode === 404) {
      throw error
    }

    console.error('[Product Detail Error]:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch product'
    })
  }
})
