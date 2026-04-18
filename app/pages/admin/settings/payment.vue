<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="font-serif italic text-3xl text-on-surface mb-2">Payment Settings</h1>
      <p class="text-on-surface-variant/70 text-sm font-body">Configure payment gateways and methods</p>
    </div>

    <!-- Payment Methods -->
    <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm shadow-primary/5 p-6 mb-6">
      <h2 class="font-serif italic text-xl text-on-surface mb-6">Payment Methods</h2>
      
      <div class="space-y-4">
        <!-- Cash on Delivery -->
        <div class="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-success text-2xl">payments</span>
            </div>
            <div>
              <div class="font-medium text-on-surface font-body">Cash on Delivery</div>
              <div class="text-sm text-on-surface-variant">Pay when you receive your order</div>
            </div>
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

        <!-- Card Payments (Paymob Egypt) -->
        <div class="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-orange-600 text-2xl">account_balance</span>
            </div>
            <div>
              <div class="font-medium text-on-surface font-body">Paymob (Egypt Cards)</div>
              <div class="text-sm text-on-surface-variant">Accept local cards via Paymob gateway</div>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="settings.isPaymobEnabled"
              type="checkbox"
              class="sr-only peer"
            />
            <div class="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </div>

        <!-- Card Payments (Stripe) -->
        <div class="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-2xl">credit_card</span>
            </div>
            <div>
              <div class="font-medium text-on-surface font-body">Global Card Payments</div>
              <div class="text-sm text-on-surface-variant">Accept international cards via Stripe</div>
            </div>
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
      </div>
    </div>

    <!-- Paymob Configuration -->
    <div v-if="settings.isPaymobEnabled" class="bg-white rounded-xl border border-outline-variant/10 shadow-sm shadow-primary/5 p-6 mb-6">
      <h2 class="font-serif italic text-xl text-on-surface mb-6">Paymob Configuration</h2>
      
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-body text-on-surface-variant mb-1">Paymob API Key</label>
          <input
            v-model="settings.paymobApiKey"
            type="password"
            class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
            placeholder="api_key_..."
          />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-body text-on-surface-variant mb-1">Integration ID</label>
            <input
              v-model="settings.paymobIntegrationId"
              type="text"
              class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
              placeholder="123456"
            />
          </div>
          <div>
            <label class="block text-sm font-body text-on-surface-variant mb-1">Iframe ID</label>
            <input
              v-model="settings.paymobIframeId"
              type="text"
              class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
              placeholder="789012"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-body text-on-surface-variant mb-1">HMAC Secret</label>
          <input
            v-model="settings.paymobHmacSecret"
            type="password"
            class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
            placeholder="hmac_..."
          />
        </div>
      </div>
    </div>

    <!-- Stripe Configuration -->
    <div v-if="settings.isStripeEnabled" class="bg-white rounded-xl border border-outline-variant/10 shadow-sm shadow-primary/5 p-6 mb-6">
      <h2 class="font-serif italic text-xl text-on-surface mb-6">Stripe Configuration</h2>
      
      <div class="space-y-6">
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
            <div class="text-sm text-on-surface-variant">Use test environment keys</div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="settings.isTestMode"
              type="checkbox"
              class="sr-only peer"
            />
            <div class="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-warning/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-warning peer-checked:after:bg-orange-500"></div>
          </label>
        </div>
      </div>
    </div>

    <!-- Transaction Log -->
    <div class="bg-white rounded-xl border border-outline-variant/10 shadow-sm shadow-primary/5 overflow-hidden">
      <div class="p-6 border-b border-outline-variant/10">
        <h2 class="font-serif italic text-xl text-on-surface">Recent Transactions</h2>
      </div>
      
      <ClientOnly>
        <template #fallback>
          <div class="p-12 text-center text-on-surface-variant font-body">Loading history...</div>
        </template>

        <div v-if="pending" class="p-12 text-center text-on-surface-variant">
          <span class="material-symbols-outlined text-3xl animate-spin">progress_activity</span>
        </div>

        <div v-else-if="!transactions?.length" class="p-12 text-center text-on-surface-variant font-body">
          No transactions yet.
        </div>

        <table v-else class="w-full">
          <thead class="bg-surface-container-low">
            <tr>
              <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Transaction ID</th>
              <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Order ID</th>
              <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Amount</th>
              <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Status</th>
              <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr
              v-for="(transaction, index) in transactions"
              :key="transaction.id || index"
              class="hover:bg-surface-container-low/50 transition-colors"
            >
              <td class="px-6 py-4 font-mono text-sm text-on-surface">
                {{ transaction.transactionId || transaction.paymentIntentId || 'N/A' }}
              </td>
              <td class="px-6 py-4 text-sm text-on-surface font-body">
                #{{ transaction.id?.slice(-8).toUpperCase() || 'N/A' }}
              </td>
              <td class="px-6 py-4 font-medium text-on-surface font-body font-semibold">
                {{ settings.currency }} {{ transaction.totalAmount?.toFixed(2) || '0.00' }}
              </td>
              <td class="px-6 py-4">
                <span :class="[
                  'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                  transaction.paymentStatus === 'PAID' ? 'bg-success/10 text-success' :
                  transaction.paymentStatus === 'FAILED' ? 'bg-error/10 text-error' :
                  transaction.paymentStatus === 'REFUNDED' ? 'bg-warning/10 text-warning' :
                  'bg-surface-container-high text-on-surface-variant'
                ]">
                  {{ transaction.paymentStatus || 'UNKNOWN' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-on-surface-variant font-body">
                {{ transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </ClientOnly>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end gap-3 mt-8">
      <button
        @click="saveSettings"
        :disabled="isSubmitting"
        class="px-10 py-3 bg-stone-900 text-white rounded-lg font-label uppercase tracking-widest text-[11px] font-bold hover:bg-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-xl shadow-stone-950/20"
      >
        <span v-if="isSubmitting" class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
        {{ isSubmitting ? 'Finalizing...' : 'Save Configuration' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['permissions'],
  permission: 'MANAGE_SETTINGS'
})

const isSubmitting = ref(false)
const { toast } = useNotifications()

const settings = ref({
  isCodEnabled: true,
  isStripeEnabled: false,
  stripePublicKey: '',
  stripeSecretKey: '',
  isPaymobEnabled: false,
  paymobApiKey: '',
  paymobIntegrationId: '',
  paymobIframeId: '',
  paymobHmacSecret: '',
  isTestMode: true,
  currency: 'EGP'
})

const { data: fetchedSettings, pending, refresh } = await useApiFetch<any>('/api/admin/settings', {
  default: () => null
})

const { data: ordersData } = await useApiFetch<any>('/api/admin/orders', {
  default: () => ({ orders: [] })
})

watch(() => fetchedSettings.value, (newSettings) => {
  if (newSettings?.settings) {
    settings.value = { ...settings.value, ...newSettings.settings }
  }
}, { immediate: true })

const transactions = computed(() => {
  const ordersArray = ordersData.value?.orders || []
  return ordersArray
    .filter((o: any) => o.paymentIntentId || o.transactionId)
    .slice(0, 20)
})

const saveSettings = async () => {
  isSubmitting.value = true
  try {
    await $apiFetch('/api/admin/settings', {
      method: 'PATCH',
      body: settings.value
    })
    
    toast.success('Payment configuration updated successfully', 'Success')
    refresh()
  } catch (error) {
    console.error('[Payment Settings Error]:', error)
    toast.error('Failed to update payment configuration', 'Configuration Error')
  } finally {
    isSubmitting.value = false
  }
}
</script>
