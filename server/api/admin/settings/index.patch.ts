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
          freeShippingThreshold: body.freeShippingThreshold ?? 0,
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
          twitterUrl: body.twitterUrl,
          linkedinUrl: body.linkedinUrl,
          isCodEnabled: body.isCodEnabled ?? true,
          isStripeEnabled: body.isStripeEnabled ?? false,
          stripePublicKey: body.stripePublicKey,
          stripeSecretKey: body.stripeSecretKey,
          isTestMode: body.isTestMode ?? false,
          isPaymobEnabled: body.isPaymobEnabled ?? false,
          paymobApiKey: body.paymobApiKey,
          paymobHmac: body.paymobHmac,
          paymobIntegrationId: body.paymobIntegrationId,
          paymobIframeId: body.paymobIframeId
        }
      })
    } else {
      // Update existing settings
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          ...(body.shippingFee !== undefined && { shippingFee: body.shippingFee }),
          ...(body.freeShippingThreshold !== undefined && { freeShippingThreshold: body.freeShippingThreshold }),
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
          ...(body.twitterUrl !== undefined && { twitterUrl: body.twitterUrl }),
          ...(body.linkedinUrl !== undefined && { linkedinUrl: body.linkedinUrl }),
          ...(body.isCodEnabled !== undefined && { isCodEnabled: body.isCodEnabled }),
          ...(body.isStripeEnabled !== undefined && { isStripeEnabled: body.isStripeEnabled }),
          ...(body.stripePublicKey !== undefined && { stripePublicKey: body.stripePublicKey }),
          ...(body.stripeSecretKey !== undefined && { stripeSecretKey: body.stripeSecretKey }),
          ...(body.isTestMode !== undefined && { isTestMode: body.isTestMode }),
          ...(body.isPaymobEnabled !== undefined && { isPaymobEnabled: body.isPaymobEnabled }),
          ...(body.paymobApiKey !== undefined && { paymobApiKey: body.paymobApiKey }),
          ...(body.paymobHmac !== undefined && { paymobHmac: body.paymobHmac }),
          ...(body.paymobIntegrationId !== undefined && { paymobIntegrationId: body.paymobIntegrationId }),
          ...(body.paymobIframeId !== undefined && { paymobIframeId: body.paymobIframeId })
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
