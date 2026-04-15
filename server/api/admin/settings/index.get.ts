import prisma from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/admin'
import { handleError } from '../../../utils/error'

/**
 * GET /api/admin/settings
 * Fetch store settings with auto-initialization
 */
export default defineEventHandler(async (event) => {
  try {
    // Verify admin access
    requireAdmin(event)

    // Get settings (singleton - should only have one record)
    let settings = await prisma.settings.findFirst()

    // If no settings exist, create default settings
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          shippingFee: 0,
          currency: 'EGP',
          maintenanceMode: false,
          siteName: 'Vigo Store'
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
    throw handleError(error)
  }
})
