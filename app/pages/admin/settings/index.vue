<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="font-serif italic text-3xl text-on-surface mb-2">Store Settings</h1>
      <p class="text-on-surface-variant/70 text-sm font-body">Manage store configuration and preferences</p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-4 mb-6 border-b border-outline-variant/10">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-4 py-3 font-body text-sm transition-colors relative',
          activeTab === tab.id ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
        ]"
      >
        {{ tab.label }}
        <span
          v-if="activeTab === tab.id"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
        />
      </button>
    </div>

    <!-- Content -->
    <div class="bg-white rounded-xl border border-outline-variant/10 shadow-sm shadow-primary/5 p-6">
      <ClientOnly>
        <template #fallback>
          <div class="text-center py-12">
            <span class="text-on-surface-variant font-body">Loading...</span>
          </div>
        </template>

        <div v-if="pending" class="text-center py-12">
          <span class="material-symbols-outlined text-3xl animate-spin text-on-surface-variant">progress_activity</span>
        </div>

        <div v-else-if="error" class="text-center py-12">
          <span class="text-error font-body">Failed to load settings</span>
        </div>

        <form v-else @submit.prevent="saveSettings">
          <!-- General Tab -->
          <div v-if="activeTab === 'general'" class="space-y-6">
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">Store Name</label>
              <input
                v-model="settings.siteName"
                type="text"
                class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
                placeholder="Vigo Store"
              />
            </div>
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">Store Description</label>
              <textarea
                v-model="settings.siteDescription"
                rows="3"
                class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50 resize-none"
                placeholder="Your store description"
              />
            </div>
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">SEO Keywords</label>
              <input
                v-model="settings.siteKeywords"
                type="text"
                class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
                placeholder="fashion, clothing, store"
              />
            </div>
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">Currency</label>
              <select
                v-model="settings.currency"
                class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
              >
                <option value="EGP">EGP - Egyptian Pound</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
            <div class="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
              <div>
                <div class="font-medium text-on-surface font-body">Maintenance Mode</div>
                <div class="text-sm text-on-surface-variant">Temporarily disable the store for maintenance</div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="settings.maintenanceMode"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div v-if="settings.maintenanceMode">
              <label class="block text-sm font-body text-on-surface-variant mb-1">Maintenance Message</label>
              <textarea
                v-model="settings.maintenanceMessage"
                rows="2"
                class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50 resize-none"
                placeholder="We're currently performing maintenance. Please check back soon."
              />
            </div>
          </div>

          <!-- Shipping Tab -->
          <div v-if="activeTab === 'shipping'" class="space-y-6">
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">Shipping Fee</label>
              <div class="relative">
                <input
                  v-model="settings.shippingFee"
                  type="number"
                  step="0.01"
                  class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
                  placeholder="0.00"
                />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-body text-sm">
                  {{ settings.currency }}
                </span>
              </div>
            </div>
          </div>

          <!-- Contact Tab -->
          <div v-if="activeTab === 'contact'" class="space-y-6">
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">Contact Email</label>
              <input
                v-model="settings.contactEmail"
                type="email"
                class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
                placeholder="contact@vigo.com"
              />
            </div>
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">Contact Phone</label>
              <input
                v-model="settings.contactPhone"
                type="tel"
                class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
                placeholder="+20 123 456 7890"
              />
            </div>
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">WhatsApp Number</label>
              <input
                v-model="settings.whatsappNumber"
                type="tel"
                class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
                placeholder="+20 123 456 7890"
              />
            </div>
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">Address</label>
              <textarea
                v-model="settings.contactAddress"
                rows="2"
                class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50 resize-none"
                placeholder="123 Main Street, Cairo, Egypt"
              />
            </div>
          </div>

          <!-- Social Tab -->
          <div v-if="activeTab === 'social'" class="space-y-6">
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">Facebook URL</label>
              <input
                v-model="settings.facebookUrl"
                type="url"
                class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
                placeholder="https://facebook.com/vigostore"
              />
            </div>
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">Instagram URL</label>
              <input
                v-model="settings.instagramUrl"
                type="url"
                class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
                placeholder="https://instagram.com/vigostore"
              />
            </div>
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">Twitter URL</label>
              <input
                v-model="settings.twitterUrl"
                type="url"
                class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
                placeholder="https://twitter.com/vigostore"
              />
            </div>
          </div>

          <!-- Payment Tab -->
          <div v-if="activeTab === 'payment'" class="space-y-6">
            <div class="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
              <div>
                <div class="font-medium text-on-surface font-body">Cash on Delivery</div>
                <div class="text-sm text-on-surface-variant">Pay when you receive your order</div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="settings.isCodEnabled"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-success/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-success"></div>
              </label>
            </div>

            <div class="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
              <div>
                <div class="font-medium text-on-surface font-body">Card Payments (Stripe)</div>
                <div class="text-sm text-on-surface-variant">Accept credit/debit cards via Stripe</div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="settings.isStripeEnabled"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div v-if="settings.isStripeEnabled" class="space-y-4 p-4 bg-surface-container-low rounded-lg">
              <div>
                <label class="block text-sm font-body text-on-surface-variant mb-1">Stripe Public Key</label>
                <input
                  v-model="settings.stripePublicKey"
                  type="text"
                  class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
                  placeholder="pk_test_..."
                />
              </div>
              
              <div>
                <label class="block text-sm font-body text-on-surface-variant mb-1">Stripe Secret Key</label>
                <input
                  v-model="settings.stripeSecretKey"
                  type="password"
                  class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
                  placeholder="sk_test_..."
                />
              </div>

              <div class="flex items-center justify-between p-4 bg-warning/10 rounded-lg">
                <div>
                  <div class="font-medium text-on-surface font-body">Test Mode</div>
                  <div class="text-sm text-on-surface-variant">Use Stripe test keys for development</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="settings.isTestMode"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-warning/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-warning"></div>
                </label>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div class="flex justify-end gap-3 mt-8 pt-6 border-t border-outline-variant/10">
            <button
              type="button"
              @click="refresh"
              class="px-6 py-2.5 border border-outline-variant/20 rounded-lg font-body text-sm hover:bg-surface-container-low transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-2.5 bg-primary text-white rounded-lg font-body text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span v-if="saving" class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const auth = useAuth()
const activeTab = ref('general')
const saving = ref(false)

const tabs = [
  { id: 'general', label: 'General' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'contact', label: 'Contact' },
  { id: 'social', label: 'Social Media' },
  { id: 'payment', label: 'Payment' }
]

const settings = ref({
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
  twitterUrl: '',
  isCodEnabled: true,
  isStripeEnabled: false,
  stripePublicKey: '',
  stripeSecretKey: '',
  isTestMode: true
})

const { data: fetchedSettings, pending, error, refresh } = await useApiFetch('/api/admin/settings', {
  default: () => null
})

watch(fetchedSettings, (newSettings) => {
  if (newSettings) {
    settings.value = { ...settings.value, ...newSettings }
  }
}, { immediate: true })

const saveSettings = async () => {
  saving.value = true
  try {
    await $fetch('/api/admin/settings', {
      method: 'PATCH',
      body: settings.value
    })
    await refresh()
    alert('Settings saved successfully')
  } catch (err) {
    alert('Failed to save settings')
  } finally {
    saving.value = false
  }
}
</script>
