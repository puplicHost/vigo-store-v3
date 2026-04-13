/**
 * Composable for managing store settings
 * Provides reactive access to store-wide settings like shipping fee and currency
 */

export const useSettings = () => {
  const settings = useState('store-settings', () => ({
    shippingFee: 0,
    currency: 'EGP',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    whatsappNumber: '',
    maintenanceMode: false,
    maintenanceMessage: '',
    siteName: '',
    siteDescription: '',
    siteKeywords: '',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: ''
  }))

  const pending = ref(false)
  const error = ref<any>(null)

  const fetchSettings = async () => {
    if (process.client) {
      pending.value = true
      try {
        const response = await $fetch('/api/admin/settings') as { success: boolean; settings: any }
        if (response?.settings) {
          settings.value = { ...settings.value, ...response.settings }
        }
      } catch (err: any) {
        console.error('Failed to fetch settings:', err)
        error.value = err
      } finally {
        pending.value = false
      }
    }
  }

  // Fetch settings on client-side
  onMounted(() => {
    fetchSettings()
  })

  return {
    settings,
    pending,
    error,
    fetchSettings
  }
}
