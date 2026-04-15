import prisma from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/admin'
import { logger } from '../../../utils/logger'

/**
 * GET /api/admin/settings
 * Fetch store settings
 */
export default defineEventHandler(async (event) => {
  // Verify admin access
  requireAdmin(event)

  try {
    // Get settings (singleton - should only have one record)
    let settings = await prisma.settings.findFirst()

    // If no settings exist, create default settings
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          shippingFee: 0,
          currency: 'EGP',
          maintenanceMode: false
        }
      })
    }

    // Remove sensitive fields before sending to client
    const { stripeSecretKey, ...safeSettings } = settings as any

    return {
      success: true,
      settings: safeSettings
    }
  } catch (error: any) {
    logger.error('[Fetch Settings Error]:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch settings'
    })
  }
})
