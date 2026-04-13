import prisma from '../../../utils/prisma'
import { requireSuperAdmin } from '../../../utils/admin'

/**
 * PATCH /api/admin/settings
 * Update store settings (SUPER_ADMIN only)
 */
export default defineEventHandler(async (event) => {
  // Verify SUPER_ADMIN access
  requireSuperAdmin(event)

  try {
    // Read request body
    const body = await readBody(event)

    // Get existing settings
    let settings = await prisma.settings.findFirst()

    // If no settings exist, create them
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          shippingFee: body.shippingFee ?? 0,
          currency: body.currency ?? 'EGP',
          contactEmail: body.contactEmail,
          contactPhone: body.contactPhone,
          contactAddress: body.contactAddress,
          whatsappNumber: body.whatsappNumber,
          maintenanceMode: body.maintenanceMode ?? false,
          maintenanceMessage: body.maintenanceMessage,
          siteName: body.siteName,
          siteDescription: body.siteDescription,
          siteKeywords: body.siteKeywords,
          facebookUrl: body.facebookUrl,
          instagramUrl: body.instagramUrl,
          twitterUrl: body.twitterUrl
        }
      })
    } else {
      // Update existing settings
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          ...(body.shippingFee !== undefined && { shippingFee: body.shippingFee }),
          ...(body.currency !== undefined && { currency: body.currency }),
          ...(body.contactEmail !== undefined && { contactEmail: body.contactEmail }),
          ...(body.contactPhone !== undefined && { contactPhone: body.contactPhone }),
          ...(body.contactAddress !== undefined && { contactAddress: body.contactAddress }),
          ...(body.whatsappNumber !== undefined && { whatsappNumber: body.whatsappNumber }),
          ...(body.maintenanceMode !== undefined && { maintenanceMode: body.maintenanceMode }),
          ...(body.maintenanceMessage !== undefined && { maintenanceMessage: body.maintenanceMessage }),
          ...(body.siteName !== undefined && { siteName: body.siteName }),
          ...(body.siteDescription !== undefined && { siteDescription: body.siteDescription }),
          ...(body.siteKeywords !== undefined && { siteKeywords: body.siteKeywords }),
          ...(body.facebookUrl !== undefined && { facebookUrl: body.facebookUrl }),
          ...(body.instagramUrl !== undefined && { instagramUrl: body.instagramUrl }),
          ...(body.twitterUrl !== undefined && { twitterUrl: body.twitterUrl })
        }
      })
    }

    return {
      success: true,
      message: 'Settings updated successfully',
      settings
    }
  } catch (error: any) {
    console.error('[Update Settings Error]:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update settings'
    })
  }
})
