import { requireAdmin } from '../../../utils/admin'
import { catalogService } from '../../../domains/catalog/services/CatalogService'
import { ErrorMapper } from '../../../shared/error/ErrorMapper'

export default defineEventHandler(async (event) => {
  return await ErrorMapper.withErrorMapping(async () => {
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

    // Parse body
    const body = await readBody(event)
    const { name } = body

    // Update category through service
    const category = await catalogService.updateCategory(
      id,
      { name: name ? name.trim() : '' },
      event.context.user.userId,
      event.context.user.role,
      event
    )

    return {
      success: true,
      message: 'Category updated successfully',
      data: category
    }
  })
})
