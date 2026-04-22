<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="font-serif italic text-3xl text-on-surface mb-2">{{ $t('settings.title') }}</h1>
      <p class="text-on-surface-variant/70 text-sm font-body">{{ $t('settings.subtitle') }}</p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-4 mb-6 border-b border-outline-variant/10 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-4 py-3 font-body text-sm transition-colors relative whitespace-nowrap',
          activeTab === tab.id ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
        ]"
      >
        {{ $t(`settings.${tab.id}`) }}
        <span
          v-if="activeTab === tab.id"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
        />
      </button>
    </div>

    <!-- Content -->
    <div class="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm shadow-primary/5 p-6 transition-colors duration-300">
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
            <!-- Site Logo -->
            <div class="space-y-4 pb-6 border-b border-outline-variant/10">
              <label class="block text-sm font-label uppercase tracking-widest text-on-surface-variant">Site Logo</label>
              <div class="flex items-center gap-6">
                <!-- Preview -->
                <div class="w-32 h-32 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-center overflow-hidden">
                  <img v-if="settings.logo" :src="settings.logo" class="w-full h-full object-contain p-2" />
                  <span v-else class="material-symbols-outlined text-4xl text-on-surface-variant/30">image</span>
                </div>
                
                <div class="space-y-3">
                  <div class="flex gap-2">
                    <button
                      type="button"
                      @click="() => logoInput?.click()"
                      class="px-4 py-2 bg-primary text-on-primary rounded-lg font-body text-xs hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      <span class="material-symbols-outlined text-sm">upload</span>
                      Change Logo
                    </button>
                    <button
                      v-if="settings.logo"
                      type="button"
                      @click="settings.logo = null"
                      class="px-4 py-2 border border-error/30 text-error rounded-lg font-body text-xs hover:bg-error/5 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  <p class="text-[10px] text-on-surface-variant/60 font-body">Recommended: PNG or SVG with transparent background.<br>Suggested size: 512x512px.</p>
                </div>
              </div>
              <input
                ref="logoInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleLogoUpload"
              />
            </div>

            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">{{ $t('products.name') }}</label>
              <input
                v-model="settings.siteName"
                type="text"
                class="w-full bg-transparent border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm font-body text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                :placeholder="$t('products.name')"
              />
            </div>
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">{{ $t('products.description') }}</label>
              <textarea
                v-model="settings.siteDescription"
                rows="3"
                class="w-full bg-transparent border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm font-body text-on-surface focus:outline-none focus:border-primary/50 resize-none transition-colors"
                :placeholder="$t('products.description')"
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
              <label class="block text-sm font-body text-on-surface-variant mb-1">{{ $t('products.price') }} (Currency)</label>
              <select
                v-model="settings.currency"
                class="w-full bg-transparent border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm font-body text-on-surface focus:outline-none focus:border-primary/50 cursor-pointer transition-colors"
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
              <label class="block text-sm font-body text-on-surface-variant mb-1">{{ $t('settings.shippingFee') }}</label>
              <div class="relative">
                <input
                  v-model="settings.shippingFee"
                  type="number"
                  step="0.01"
                  class="w-full bg-transparent border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm font-body text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="0.00"
                />
                <span class="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-body text-sm">
                  {{ settings.currency }}
                </span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">{{ $t('settings.freeShippingThreshold') }}</label>
              <div class="relative">
                <input
                  v-model="settings.freeShippingThreshold"
                  type="number"
                  step="0.01"
                  class="w-full bg-transparent border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm font-body text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="0.00"
                />
                <span class="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-body text-sm">
                  {{ settings.currency }}
                </span>
              </div>
            </div>
          </div>

          <!-- Contact Tab -->
          <div v-if="activeTab === 'contact'" class="space-y-6">
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">{{ $t('settings.contactEmail') }}</label>
              <input
                v-model="settings.contactEmail"
                type="email"
                class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
                placeholder="contact@vigo.com"
              />
            </div>
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">{{ $t('settings.contactPhone') }}</label>
              <input
                v-model="settings.contactPhone"
                type="tel"
                class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
                placeholder="+20 123 456 7890"
              />
            </div>
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">{{ $t('settings.whatsappNumber') }}</label>
              <input
                v-model="settings.whatsappNumber"
                type="tel"
                class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
                placeholder="+20 123 456 7890"
              />
            </div>
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">{{ $t('settings.address') }}</label>
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
              <label class="block text-sm font-body text-on-surface-variant mb-1">{{ $t('settings.tiktokUrl') }}</label>
              <input
                v-model="settings.tiktokUrl"
                type="url"
                class="w-full bg-transparent border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm font-body text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="https://tiktok.com/@..."
              />
            </div>
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">{{ $t('settings.instagramUrl') }}</label>
              <input
                v-model="settings.instagramUrl"
                type="url"
                class="w-full bg-transparent border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm font-body text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">{{ $t('settings.facebookUrl') }}</label>
              <input
                v-model="settings.facebookUrl"
                type="url"
                class="w-full bg-transparent border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm font-body text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">Snapchat URL</label>
              <input
                v-model="settings.snapchatUrl"
                type="url"
                class="w-full bg-transparent border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm font-body text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="https://snapchat.com/add/..."
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

            <div class="flex items-center justify-between p-4 bg-surface-container-low rounded-lg mt-6">
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

            <div class="flex items-center justify-between p-4 bg-surface-container-low rounded-lg mt-6">
              <div>
                <div class="font-medium text-on-surface font-body">Card Settings (Paymob)</div>
                <div class="text-sm text-on-surface-variant">Accept payments locally via Paymob</div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="settings.isPaymobEnabled"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div v-if="settings.isPaymobEnabled" class="space-y-4 p-4 bg-surface-container-low rounded-lg">
              <div>
                <label class="block text-sm font-body text-on-surface-variant mb-1">Paymob API Key</label>
                <input
                  v-model="settings.paymobApiKey"
                  type="password"
                  class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
                  placeholder="ZXlK..."
                />
              </div>

              <div>
                <label class="block text-sm font-body text-on-surface-variant mb-1">Paymob HMAC</label>
                <input
                  v-model="settings.paymobHmac"
                  type="password"
                  class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
                  placeholder="Enter HMAC Secret"
                />
              </div>

              <div>
                <label class="block text-sm font-body text-on-surface-variant mb-1">Integration ID (Card)</label>
                <input
                  v-model="settings.paymobIntegrationId"
                  type="text"
                  class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
                  placeholder="Ex: 4543212"
                />
              </div>

              <div>
                <label class="block text-sm font-body text-on-surface-variant mb-1">Iframe ID</label>
                <input
                  v-model="settings.paymobIframeId"
                  type="text"
                  class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
                  placeholder="Ex: 853232"
                />
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div class="flex justify-end gap-3 mt-8 pt-6 border-t border-outline-variant/10">
            <button
              type="button"
              @click="fetchSettings"
              class="px-6 py-2.5 border border-outline-variant/30 rounded-lg font-body text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              {{ $t('settings.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-body text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span v-if="saving" class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
              {{ saving ? $t('settings.saving') : $t('settings.save') }}
            </button>
          </div>
        </form>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['permissions'],
  permission: 'MANAGE_SETTINGS'
})

const { settings, pending, error, updateSettings, fetchSettings } = useSettings()
const { toast } = useNotifications()
const activeTab = ref('general')
const saving = ref(false)
const logoInput = ref<HTMLInputElement | null>(null)

const handleLogoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || !files[0]) return

  const file = files[0]
  if (!file.type.startsWith('image/')) {
    toast.error('Please upload an image file')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    if (result) settings.value.logo = result
  }
  reader.readAsDataURL(file)
}

const tabs = [
  { id: 'general', label: 'General' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'contact', label: 'Contact' },
  { id: 'social', label: 'Social Media' },
  { id: 'payment', label: 'Payment' }
]

// Fetch full admin settings including secure keys
onMounted(async () => {
  try {
    const response = await $apiFetch<any>('/api/admin/settings')
    if (response?.settings) {
      Object.assign(settings.value, response.settings)
    }
  } catch (err) {
    console.error('Failed to load full admin settings:', err)
  }
})

const saveSettings = async () => {
  saving.value = true
  try {
    await updateSettings(settings.value)
    toast.success('Settings saved successfully')
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Failed to save settings')
  } finally {
    saving.value = false
  }
}
</script>
