<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant/10 pb-6">
      <div>
        <h1 class="font-serif italic text-4xl text-on-surface mb-2">Payment Terminal</h1>
        <p class="text-on-surface-variant/70 text-sm font-body">Audit and monitor all transaction attempts and settlement statuses.</p>
      </div>
      
      <div class="flex items-center gap-3">
        <div class="relative group">
          <input 
            v-model="search" 
            type="text" 
            placeholder="Search Order ID or Customer..." 
            class="bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-10 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50 transition-all w-64"
          />
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
        </div>
      </div>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card-premium p-6 flex flex-col justify-between">
        <p class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-2">Total Settlement</p>
        <div class="flex items-end justify-between">
          <p class="text-3xl font-serif italic font-bold text-on-surface">{{ settings.currency }} {{ totalSettled.toFixed(0) }}</p>
          <div class="w-10 h-10 rounded-xl bg-success-soft flex items-center justify-center">
            <span class="material-symbols-outlined text-success-solid">account_balance_wallet</span>
          </div>
        </div>
      </div>
      <div class="card-premium p-6 flex flex-col justify-between">
        <p class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-2">Pending Reconciliation</p>
        <div class="flex items-end justify-between">
          <p class="text-3xl font-serif italic font-bold text-on-surface">{{ pendingCount }}</p>
          <div class="w-10 h-10 rounded-xl bg-warning-soft flex items-center justify-center">
            <span class="material-symbols-outlined text-warning-solid">pending_actions</span>
          </div>
        </div>
      </div>
      <div class="card-premium p-6 flex flex-col justify-between">
        <p class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-2">Digital Success Rate</p>
        <div class="flex items-end justify-between">
          <p class="text-3xl font-serif italic font-bold text-on-surface">{{ successRate }}%</p>
          <div class="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center">
            <span class="material-symbols-outlined text-primary-solid">verified_user</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-4 mb-4">
      <button 
        v-for="status in ['ALL', 'PAID', 'PENDING', 'FAILED']" 
        :key="status"
        @click="filterStatus = status === 'ALL' ? '' : status"
        :class="[
          'px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border',
          (filterStatus === status || (status === 'ALL' && !filterStatus)) 
            ? 'bg-primary/10 border-primary/20 text-primary' 
            : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant hover:border-primary/20'
        ]"
      >
        {{ status }}
      </button>
    </div>

    <!-- Main Table -->
    <AdminTable
      :headers="headers"
      :items="payments"
      :loading="pending"
    >
      <template #item-id="{ item }">
        <span class="font-mono text-[10px] font-bold text-primary-solid">#{{ item.id.slice(-8).toUpperCase() }}</span>
      </template>

      <template #item-customer="{ item }">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center">
            <span class="material-symbols-outlined text-on-surface-variant text-sm">person</span>
          </div>
          <div>
            <p class="text-sm font-semibold text-on-surface font-body">{{ item.user?.name || 'Guest' }}</p>
            <p class="text-[10px] text-on-surface-variant font-body">{{ item.user?.email || 'N/A' }}</p>
          </div>
        </div>
      </template>

      <template #item-method="{ item }">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-sm text-on-surface-variant italic">
            credit_card
          </span>
          <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface">{{ item.paymentMethod }}</span>
        </div>
      </template>

      <template #item-amount="{ item }">
        <span class="text-sm font-bold text-on-surface font-body tabular-nums">
          {{ settings.currency }} {{ item.totalAmount.toFixed(0) }}
        </span>
      </template>

      <template #item-status="{ item }">
        <StatusBadge :status="item.paymentStatus" />
      </template>

      <template #item-date="{ item }">
        <span class="text-[11px] text-on-surface-variant font-body">
          {{ new Date(item.createdAt).toLocaleDateString() }}
        </span>
      </template>

      <template #item-actions="{ item }">
        <button 
          @click="openDetails(item)"
          class="w-8 h-8 rounded-lg hover:bg-primary/5 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all"
        >
          <span class="material-symbols-outlined text-lg">visibility</span>
        </button>
      </template>
    </AdminTable>

    <!-- Details Modal -->
    <AdminModal v-if="selectedOrder" @close="selectedOrder = null">
      <template #header>
        <div class="flex items-center gap-4">
           <span class="material-symbols-outlined text-primary-solid">receipt</span>
           <h3 class="font-serif italic text-2xl">Transaction Manifest</h3>
        </div>
      </template>
      
      <div class="space-y-8 py-4">
        <!-- Customer & Order Basic -->
        <div class="grid grid-cols-2 gap-8 ring-1 ring-outline-variant/10 p-6 rounded-2xl bg-surface-container-lowest">
          <div class="space-y-1">
            <p class="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant">Intended Recipient</p>
            <p class="text-lg font-serif italic font-bold">{{ selectedOrder.user?.name }}</p>
            <p class="text-xs text-on-surface-variant font-body">{{ selectedOrder.user?.email }}</p>
          </div>
          <div class="space-y-1 text-right">
            <p class="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant">Order Registry</p>
            <p class="font-mono text-sm font-bold text-primary-solid">#{{ selectedOrder.id }}</p>
            <p class="text-[10px] text-on-surface-variant font-body italic">{{ new Date(selectedOrder.createdAt).toLocaleString() }}</p>
          </div>
        </div>

        <!-- Line Items -->
        <div class="space-y-4">
          <h4 class="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface pb-2 border-b border-outline-variant/20 italic font-serif">Selected Archive Items</h4>
          <div v-for="item in selectedOrder.items" :key="item.id" class="flex items-center justify-between py-2">
            <div class="flex items-center gap-4">
              <div class="w-12 h-16 bg-surface-container-low rounded-lg overflow-hidden border border-outline-variant/10">
                <img :src="item.product?.images?.[0]" class="w-full h-full object-cover" />
              </div>
              <div>
                <p class="text-sm font-semibold italic font-serif">{{ item.product?.name }}</p>
                <p class="text-[10px] text-on-surface-variant font-body">Qty: {{ item.quantity }} × {{ settings.currency }} {{ item.price.toFixed(0) }}</p>
              </div>
            </div>
            <p class="text-sm font-bold font-body tabular-nums">{{ settings.currency }} {{ (item.price * item.quantity).toFixed(0) }}</p>
          </div>
        </div>

        <!-- Transaction Inspector -->
        <div v-if="selectedOrder.payments?.[0]" class="space-y-3">
          <h4 class="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant italic">Gateway Inspector Output</h4>
          <div class="bg-[#0f172a] p-4 rounded-xl border border-white/5 overflow-x-auto max-h-60 scrollbar-custom">
            <pre class="text-[10px] text-success-solid font-mono">{{ JSON.stringify(selectedOrder.payments[0].rawResponse, null, 2) }}</pre>
          </div>
        </div>

        <!-- Financial Summary -->
        <div class="bg-surface-container-low/50 p-6 rounded-2xl space-y-4">
          <div class="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            <span>Settlement Mode</span>
            <span class="text-on-surface italic">{{ selectedOrder.paymentMethod }}</span>
          </div>
          <div v-if="selectedOrder.transactionId" class="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-on-surface-variant">
             <span>Gateway Ref</span>
             <span class="font-mono text-primary-solid">{{ selectedOrder.transactionId }}</span>
          </div>
          <div class="h-px bg-outline-variant/10"></div>
          <div class="flex justify-between items-end">
            <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface">Total Reconciled Value</span>
            <span class="text-3xl font-serif italic font-bold text-on-surface">{{ settings.currency }} {{ selectedOrder.totalAmount.toFixed(0) }}</span>
          </div>
        </div>
      </div>
    </AdminModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['permissions'],
  permission: 'MANAGE_SETTINGS'
})

const { settings } = useSettings()
const search = ref('')
const filterStatus = ref('')
const selectedOrder = ref<any>(null)

const headers = [
  { key: 'id', label: 'Order ID' },
  { key: 'customer', label: 'Customer' },
  { key: 'method', label: 'Modality' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Arrival Date' },
  { key: 'actions', label: '' }
]

const { data, pending, refresh } = await useApiFetch('/api/admin/payments', {
  query: computed(() => ({
    search: search.value,
    status: filterStatus.value,
    limit: 50
  }))
})

const payments = computed(() => data.value?.items || [])

// Computed Stats
const totalSettled = computed(() => payments.value
  .filter((p: any) => p.paymentStatus === 'PAID')
  .reduce((sum: number, p: any) => sum + p.totalAmount, 0)
)
const pendingCount = computed(() => payments.value.filter((p: any) => p.paymentStatus === 'PENDING').length)
const successRate = computed(() => {
  if (!payments.value.length) return 0
  const total = payments.value.length
  const paid = payments.value.filter((p: any) => p.paymentStatus === 'PAID').length
  return Math.round((paid / total) * 100)
})

const openDetails = (order: any) => {
  selectedOrder.value = order
}

watch([search, filterStatus], () => {
  refresh()
})
</script>
