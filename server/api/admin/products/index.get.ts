import { requireAdmin } from '../../../utils/admin'
import { productsService } from '../../../domains/catalog/services/ProductsService'

export default defineEventHandler(async (event) => {
  try {
    // Verify admin access
    requireAdmin(event)

    // Get filter and pagination parameters
    const query = getQuery(event)
    const showArchived = query.showArchived === 'true'
    const page = Math.max(parseInt(query.page as string) || 1, 1)
    const limit = Math.min(Math.max(parseInt(query.limit as string) || 20, 1), 100)

    // Fetch products using service
    const result = await productsService.listProducts({
      page,
      limit
    })

    // Return standardized format
    return {
      success: true,
      items: result.products,
      total: result.total,
      page: result.page,
      limit: result.limit
    }
  } catch (error: any) {
    console.error('[Products Error]:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load products'
    })
  }
})
