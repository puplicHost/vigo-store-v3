/**
 * Composable for managing store settings
 * Provides reactive access to store-wide settings like shipping fee, currency, and payment methods
 */

export const useSettings = () => {
  const settings = useState('store-settings', () => ({
    shippingFee: 0,
    freeShippingThreshold: 0,
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
    twitterUrl: '',
    isCodEnabled: true,
    isStripeEnabled: false,
    stripePublicKey: '',
    stripeSecretKey: '',
    isTestMode: true
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

  const updateSettings = async (newSettings: any) => {
    if (process.client) {
      pending.value = true
      try {
        const response = await $fetch('/api/admin/settings', {
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
    fetchSettings,
    updateSettings
  }
}
