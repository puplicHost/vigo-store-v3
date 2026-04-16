/**
 * Settings Service
 * Business logic for store settings management
 * With caching support for improved performance
 */

import { settingsRepository } from '../repositories/SettingsRepository'
import { getCacheProvider } from '../../../shared/cache/CacheProvider'
import { auditLogService } from '../../../shared/audit/AuditLogService'
import type { SettingsDTO } from '../../../../shared/dto'

// Cache keys
const CACHE_KEY = 'settings:all'

// Cache TTL in seconds (10 minutes for settings)
const CACHE_TTL = 600

export class SettingsService {
  private cache = getCacheProvider()

  /**
   * Get all settings (with caching)
   */
  async getSettings(forceRefresh: boolean = false): Promise<SettingsDTO> {
    // Try to get from cache
    if (!forceRefresh) {
      const cached = await this.cache.get<SettingsDTO>(CACHE_KEY)
      if (cached) {
        return cached
      }
    }

    // Fetch from database
    const settings = await settingsRepository.getSettings()

    // Cache the result
    await this.cache.set(CACHE_KEY, settings, CACHE_TTL)

    return settings
  }

  /**
   * Update settings (invalidates cache + audit logging)
   */
  async updateSettings(data: Partial<SettingsDTO>, userId: string, userRole: string, event?: any): Promise<SettingsDTO> {
    // Get current settings for audit
    const currentSettings = await settingsRepository.getSettings()

    // Calculate changes for audit
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== currentSettings[key as keyof SettingsDTO]) {
        changes[key] = {
          from: currentSettings[key as keyof SettingsDTO],
          to: value
        }
      }
    })

    // Update in database
    const settings = await settingsRepository.updateSettings(data)

    // Invalidate cache
    await this.cache.del(CACHE_KEY)

    // Log audit if there were changes
    if (Object.keys(changes).length > 0) {
      await auditLogService.logUpdate({
        userId,
        userRole,
        resource: 'settings',
        resourceId: '1', // Settings is a singleton
        changes,
        event
      })
    }

    return settings
  }

  /**
   * Invalidate settings cache
   */
  async invalidateCache(): Promise<void> {
    await this.cache.del(CACHE_KEY)
  }
}

// Singleton instance
export const settingsService = new SettingsService()
