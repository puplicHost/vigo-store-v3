import prisma from '../utils/prisma'
import { handleError } from '../utils/error'

export default defineEventHandler(async (event) => {
  try {
    // Public API - only return non-sensitive settings
    const settings = await prisma.settings.findFirst()
    
    if (!settings) {
      // Return defaults if no settings exist yet
      return {
        siteName: 'Vigo Store',
        siteDescription: 'Modern Editorial E-commerce',
        currency: 'EGP',
        maintenanceMode: false,
        isCodEnabled: true,
        isStripeEnabled: false
      }
    }

    return {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      siteKeywords: settings.siteKeywords,
      currency: settings.currency,
      maintenanceMode: settings.maintenanceMode,
      maintenanceMessage: settings.maintenanceMessage,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      contactAddress: settings.contactAddress,
      whatsappNumber: settings.whatsappNumber,
      facebookUrl: settings.facebookUrl,
      instagramUrl: settings.instagramUrl,
      twitterUrl: settings.twitterUrl,
      linkedinUrl: settings.linkedinUrl,
      tiktokUrl: settings.tiktokUrl,
      snapchatUrl: settings.snapchatUrl,
      shippingFee: settings.shippingFee,
      freeShippingThreshold: settings.freeShippingThreshold,
      isCodEnabled: settings.isCodEnabled,
      isStripeEnabled: settings.isStripeEnabled,
      isPaymobEnabled: settings.isPaymobEnabled,
      logo: settings.logo,
      // NOTE: We EXCLUDE stripeSecretKey, stripePublicKey, and isTestMode for security
    }
  } catch (error: any) {
    throw handleError(error)
  }
})
