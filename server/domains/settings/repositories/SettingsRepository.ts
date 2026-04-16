/**
 * Settings Repository
 * Handles all database operations related to store settings
 */

import prisma from '../../../utils/prisma'
import type { SettingsDTO } from '../../../../shared/dto'

export class SettingsRepository {
  /**
   * Get all settings (singleton record)
   */
  async getSettings(): Promise<SettingsDTO> {
    const settings = await prisma.settings.findFirst()
    
    if (!settings) {
      // Return default settings if none exist
      return this.getDefaultSettings()
    }

    return this.toSettingsDTO(settings)
  }

  /**
   * Update settings
   */
  async updateSettings(data: Partial<SettingsDTO>): Promise<SettingsDTO> {
    // Build Prisma update data with proper types
    const prismaData: any = {}
    
    if (data.shippingFee !== undefined) prismaData.shippingFee = Number(data.shippingFee)
    if (data.freeShippingThreshold !== undefined) prismaData.freeShippingThreshold = Number(data.freeShippingThreshold)
    if (data.currency !== undefined) prismaData.currency = String(data.currency)
    if (data.contactEmail !== undefined) prismaData.contactEmail = String(data.contactEmail)
    if (data.contactPhone !== undefined) prismaData.contactPhone = data.contactPhone || null
    if (data.contactAddress !== undefined) prismaData.contactAddress = data.contactAddress || null
    if (data.whatsappNumber !== undefined) prismaData.whatsappNumber = data.whatsappNumber || null
    if (data.maintenanceMode !== undefined) prismaData.maintenanceMode = Boolean(data.maintenanceMode)
    if (data.maintenanceMessage !== undefined) prismaData.maintenanceMessage = data.maintenanceMessage || null
    if (data.siteName !== undefined) prismaData.siteName = String(data.siteName)
    if (data.siteDescription !== undefined) prismaData.siteDescription = data.siteDescription || null
    if (data.siteKeywords !== undefined) prismaData.siteKeywords = data.siteKeywords || null
    if (data.facebookUrl !== undefined) prismaData.facebookUrl = data.facebookUrl || null
    if (data.twitterUrl !== undefined) prismaData.twitterUrl = data.twitterUrl || null
    if (data.instagramUrl !== undefined) prismaData.instagramUrl = data.instagramUrl || null
    if (data.linkedinUrl !== undefined) prismaData.linkedinUrl = data.linkedinUrl || null
    if (data.stripePublicKey !== undefined) prismaData.stripePublicKey = data.stripePublicKey || null

    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: prismaData,
      create: {
        ...this.getDefaultPrismaSettings(),
        ...prismaData
      }
    })

    return this.toSettingsDTO(settings)
  }

  /**
   * Get default settings (DTO format)
   */
  private getDefaultSettings(): SettingsDTO {
    return {
      shippingFee: 0,
      freeShippingThreshold: 0,
      currency: 'USD',
      contactEmail: '',
      contactPhone: null,
      contactAddress: null,
      whatsappNumber: null,
      maintenanceMode: false,
      maintenanceMessage: null,
      siteName: 'Vigo Store',
      siteDescription: null,
      siteKeywords: null,
      facebookUrl: null,
      twitterUrl: null,
      instagramUrl: null,
      linkedinUrl: null,
      stripePublicKey: null,
      updatedAt: new Date().toISOString()
    }
  }

  /**
   * Get default Prisma settings (Prisma-compatible format)
   */
  private getDefaultPrismaSettings(): Record<string, unknown> {
    return {
      shippingFee: 0,
      freeShippingThreshold: 0,
      currency: 'USD',
      contactEmail: '',
      contactPhone: null,
      contactAddress: null,
      whatsappNumber: null,
      maintenanceMode: false,
      maintenanceMessage: null,
      siteName: 'Vigo Store',
      siteDescription: null,
      siteKeywords: null,
      facebookUrl: null,
      twitterUrl: null,
      instagramUrl: null,
      linkedinUrl: null,
      stripePublicKey: null
    }
  }

  /**
   * Convert Prisma settings to DTO
   */
  private toSettingsDTO(settings: any): SettingsDTO {
    return {
      shippingFee: Number(settings.shippingFee),
      freeShippingThreshold: Number(settings.freeShippingThreshold),
      currency: settings.currency,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      contactAddress: settings.contactAddress,
      whatsappNumber: settings.whatsappNumber,
      maintenanceMode: settings.maintenanceMode,
      maintenanceMessage: settings.maintenanceMessage,
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      siteKeywords: settings.siteKeywords,
      facebookUrl: settings.facebookUrl,
      twitterUrl: settings.twitterUrl,
      instagramUrl: settings.instagramUrl,
      linkedinUrl: settings.linkedinUrl,
      stripePublicKey: settings.stripePublicKey,
      updatedAt: settings.updatedAt.toISOString()
    }
  }
}

// Singleton instance
export const settingsRepository = new SettingsRepository()
