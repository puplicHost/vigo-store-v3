import { requireAdmin } from '../../../utils/admin'
import { catalogService } from '../../../domains/catalog/services/CatalogService'
import { ErrorMapper } from '../../../shared/error/ErrorMapper'

export default defineEventHandler(async (event) => {
  return await ErrorMapper.withErrorMapping(async () => {
    // Verify admin access
    requireAdmin(event)

    // Parse body
    const body = await readBody(event)
    const { name } = body

    // Create category through service
    const category = await catalogService.createCategory(
      { name: name ? name.trim() : '' },
      event.context.user.userId,
      event.context.user.role, 
      event
    )

    return {
      success: true,
      message: 'Category created successfully',
      data: category
    }
  })
})
