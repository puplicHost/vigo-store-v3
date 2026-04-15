/**
 * Composable for managing store settings
 * Provides reactive access to store-wide settings with centralized fetching
 */
export const useSettings = () => {
  const settings = useState<any>('store-settings', () => ({
    shippingFee: 0,
    freeShippingThreshold: 0,
    currency: 'EGP',
    siteName: 'Vigo Store',
    maintenanceMode: false
  }))

  const error = ref<any>(null)

  // Use useAsyncData for SSR-friendly, deduplicated fetching
  const { data, pending, refresh, error: fetchError } = useAsyncData(
    'settings',
    () => $apiFetch('/api/admin/settings'),
    {
      // Only fetch on client if not already hydrated
      server: true,
      lazy: true,
      transform: (res: any) => res?.settings || res
    }
  )

  // Sync state when data is loaded
  watch(data, (newVal) => {
    if (newVal) {
      settings.value = { ...settings.value, ...newVal }
    }
  }, { immediate: true })

  // Manual update function
  const updateSettings = async (newSettings: any) => {
    try {
      const response = await $apiFetch('/api/admin/settings', {
        method: 'PATCH',
        body: newSettings
      }) as { success: boolean; settings: any }
      
      if (response?.settings) {
        settings.value = { ...settings.value, ...response.settings }
      }
      return response
    } catch (err: any) {
      console.error('Failed to update settings:', err)
      error.value = err
      throw err
    }
  }

  return {
    settings,
    pending,
    error: fetchError || error,
    fetchSettings: refresh,
    updateSettings
  }
}
