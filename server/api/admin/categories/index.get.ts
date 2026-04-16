import { requireAdmin } from '../../../utils/admin'
import { catalogService } from '../../../domains/catalog/services/CatalogService'

export default defineEventHandler(async (event) => {
  try {
    // Verify admin access
    requireAdmin(event)

    // Fetch categories using service
    const categories = await catalogService.getCategories()

    return categories
  } catch (error: any) {
    console.error('[Categories Error]:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch categories'
    })
  }
})
