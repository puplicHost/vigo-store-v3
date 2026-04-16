import { requireAdmin } from '../../../utils/admin'
import { catalogService } from '../../../domains/catalog/services/CatalogService'
import { ErrorMapper } from '../../../shared/error/ErrorMapper'
import { logger } from '../../../utils/logger'

export default defineEventHandler(async (event) => {
  return await ErrorMapper.withErrorMapping(async () => {
    // Verify admin access
    requireAdmin(event)

    // Fetch categories using service
    const categories = await catalogService.getCategories()

    // Ensure array is returned (never null)
    const items = Array.isArray(categories) ? categories : []

    // Return deterministic response shape
    return {
      items,
      total: items.length
    }
  })
})
