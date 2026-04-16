import { requireAdmin } from '../../../utils/admin'
import { settingsService } from '../../../domains/settings/services/SettingsService'

/**
 * GET /api/admin/settings
 * Fetch store settings using SettingsService
 */
export default defineEventHandler(async (event) => {
  try {
    // Verify admin access
    requireAdmin(event)

    // Get settings using service
    const settings = await settingsService.getSettings()

    return {
      success: true,
      settings
    }
  } catch (error: any) {
    console.error('[Settings Error]:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load settings'
    })
  }
})
