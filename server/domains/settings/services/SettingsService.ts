/**
 * Settings Service
 * Business logic for store settings management
 */

import { settingsRepository } from '../repositories/SettingsRepository'
import type { SettingsDTO } from '../../../../shared/dto'

export class SettingsService {
  /**
   * Get all settings
   */
  async getSettings(): Promise<SettingsDTO> {
    return await settingsRepository.getSettings()
  }

  /**
   * Update settings
   */
  async updateSettings(data: Partial<SettingsDTO>): Promise<SettingsDTO> {
    return await settingsRepository.updateSettings(data)
  }
}

// Singleton instance
export const settingsService = new SettingsService()
