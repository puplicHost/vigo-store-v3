<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-serif italic text-3xl text-on-surface mb-2">Orders</h1>
        <p class="text-on-surface-variant/70 text-sm font-body">Manage customer orders</p>
      </div>
      <button
        @click="exportToExcel"
        class="btn-gradient px-6 py-3 rounded-lg text-on-primary font-label text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <span class="material-symbols-outlined text-lg">download</span>
        Export to Excel
      </button>
    </div>

    <!-- Filters -->
    <div class="flex gap-4 mb-6">
      <div class="relative">
        <select
          v-model="statusFilter"
class="appearance-none bg-surface-container-lowest border border-outline-variant/20 rounded-lg py-2.5 pl-4 pr-10 text-sm font-body focus:outline-none focus:border-primary/50 cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
      </div>
    </div>

    <!-- Table -->
    <AdminTable
      :columns="columns"
      :data="filteredOrders"
      :loading="pending"
      :show-pagination="true"
      :pageSize="10"
      empty-message="No orders found."
      empty-icon="shopping_bag"
    >
      <template #cell-id="{ row }">
        <span class="font-mono text-sm text-on-surface">#{{ row.id?.slice(-8).toUpperCase() || 'N/A' }}</span>
      </template>

      <template #cell-customer="{ row }">
        <div>
          <div class="font-medium text-on-surface font-body">{{ row.user?.name || 'Guest' }}</div>
          <div class="text-xs text-on-surface-variant">{{ row.user?.email }}</div>
        </div>
      </template>

      <template #cell-items="{ row }">
        <span class="text-sm text-on-surface-variant font-body">{{ row.items?.length || 0 }} items</span>
      </template>

      <template #cell-totalAmount="{ row }">
        <span class="font-medium text-on-surface font-body">${{ row.totalAmount?.toFixed(2) || '0.00' }}</span>
      </template>

      <template #cell-status="{ row }">
        <span :class="[
          'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
          row.status === 'CONFIRMED' ? 'bg-success/10 text-success' :
          row.status === 'CANCELLED' ? 'bg-error/10 text-error' :
          'bg-slate-100 text-slate-400'
        ]">
          {{ row.status || 'UNKNOWN' }}
        </span>
      </template>

      <template #cell-createdAt="{ row }">
        <span class="text-sm text-on-surface-variant font-body">{{ row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-' }}</span>
      </template>

      <template #actions="{ row }">
        <div class="inline-flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant/30 text-on-surface text-xs font-medium font-body hover:bg-surface-container-low hover:border-primary/30 transition-colors"
            @click="openOrderDetail(row.id)"
          >
            <span class="material-symbols-outlined text-base">visibility</span>
            Details
          </button>
          <button
            v-if="canDeleteOrder"
            type="button"
            class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-error/25 text-error text-xs font-medium font-body hover:bg-error/10 transition-colors"
            title="Delete order"
            @click="askDeleteOrder(row.id, row.id?.slice(-8).toUpperCase() || '')"
          >
            <span class="material-symbols-outlined text-base">delete</span>
            Delete
          </button>
        </div>
      </template>
    </AdminTable>

    <!-- Order detail modal -->
    <div
      v-if="detailModalOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-detail-title"
      @click.self="closeOrderDetail"
    >
      <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col my-auto">
        <div class="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between gap-4 shrink-0">
          <h2 id="order-detail-title" class="font-serif italic text-xl text-on-surface">
            Order details
          </h2>
          <button
            type="button"
            class="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
            aria-label="Close"
            @click="closeOrderDetail"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="px-6 py-4 overflow-y-auto flex-1 min-h-0">
          <div v-if="detailLoading" class="flex flex-col items-center justify-center py-12 gap-3 text-on-surface-variant">
            <span class="material-symbols-outlined text-3xl animate-spin">progress_activity</span>
            <span class="text-sm font-body">Loading…</span>
          </div>
          <div v-else-if="detailError" class="text-error text-sm font-body py-4">
            {{ detailError }}
          </div>
          <div v-else-if="orderDetail" class="space-y-6 text-sm font-body">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p class="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-1">Order ID</p>
                <p class="font-mono text-on-surface">#{{ orderDetail.id?.slice(-8).toUpperCase() }}</p>
              </div>
              <div>
                <p class="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-1">Placed</p>
                <p class="text-on-surface">
                  {{ orderDetail.createdAt ? new Date(orderDetail.createdAt).toLocaleString() : '—' }}
                </p>
              </div>
            </div>

            <div>
              <p class="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-2">Customer</p>
              <p class="font-medium text-on-surface">{{ orderDetail.user?.name || 'Guest' }}</p>
              <p class="text-on-surface-variant text-xs mt-0.5">{{ orderDetail.user?.email || '—' }}</p>
            </div>

            <!-- Shipping address: JSON from checkout or legacy plain text -->
            <div
              v-if="parsedShipping !== null"
              class="rounded-xl border border-outline-variant/20 bg-surface-container-low/50 p-4 shadow-sm"
            >
              <div class="flex items-start gap-3">
                <div
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
                  aria-hidden="true"
                >
                  <span class="material-symbols-outlined text-[22px]">local_shipping</span>
                </div>
                <div class="min-w-0 flex-1 space-y-3">
                  <p class="text-[10px] font-medium uppercase tracking-[0.2em] text-on-surface-variant">
                    Shipping address
                  </p>

                  <template v-if="shippingHasStructure">
                    <div v-if="shippingRecipientName" class="flex gap-3">
                      <span class="material-symbols-outlined mt-0.5 text-lg text-on-surface-variant/70">person</span>
                      <div class="min-w-0">
                        <p class="text-[10px] uppercase tracking-wide text-on-surface-variant">Recipient</p>
                        <p class="font-medium leading-snug text-on-surface">{{ shippingRecipientName }}</p>
                      </div>
                    </div>
                    <div v-if="parsedShipping.phone" class="flex gap-3">
                      <span class="material-symbols-outlined mt-0.5 text-lg text-on-surface-variant/70">call</span>
                      <div class="min-w-0">
                        <p class="text-[10px] uppercase tracking-wide text-on-surface-variant">Phone</p>
                        <a
                          :href="'tel:' + String(parsedShipping.phone).replace(/\s/g, '')"
                          class="font-medium text-primary hover:underline"
                        >{{ parsedShipping.phone }}</a>
                      </div>
                    </div>
                    <div v-if="parsedShipping.address" class="flex gap-3">
                      <span class="material-symbols-outlined mt-0.5 text-lg text-on-surface-variant/70">home_pin</span>
                      <div class="min-w-0">
                        <p class="text-[10px] uppercase tracking-wide text-on-surface-variant">Address</p>
                        <p class="leading-relaxed text-on-surface">{{ parsedShipping.address }}</p>
                      </div>
                    </div>
                    <div
                      v-if="shippingCityLine"
                      class="flex gap-3"
                    >
                      <span class="material-symbols-outlined mt-0.5 text-lg text-on-surface-variant/70">map</span>
                      <div class="min-w-0">
                        <p class="text-[10px] uppercase tracking-wide text-on-surface-variant">City & country</p>
                        <p class="text-on-surface">{{ shippingCityLine }}</p>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="parsedShipping._raw">
                    <p class="rounded-lg border border-outline-variant/15 bg-surface-container-lowest/80 px-3 py-2.5 font-mono text-xs leading-relaxed text-on-surface whitespace-pre-wrap">
                      {{ parsedShipping._raw }}
                    </p>
                  </template>
                  <p v-else class="text-sm italic text-on-surface-variant">
                    No address lines on file.
                  </p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p class="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-1">Order status</p>
                <p class="text-on-surface">{{ orderDetail.status }}</p>
              </div>
              <div>
                <p class="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-1">Payment</p>
                <p class="text-on-surface">
                  {{ orderDetail.paymentStatus }} · {{ orderDetail.paymentMethod || '—' }}
                </p>
              </div>
            </div>

            <div>
              <p class="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-2">Items</p>
              <ul class="rounded-lg border border-outline-variant/15 divide-y divide-outline-variant/10 overflow-hidden">
                <li
                  v-for="(line, idx) in orderDetail.items || []"
                  :key="line.id || idx"
                  class="px-3 py-2.5 flex gap-3 bg-surface-container-low/30"
                >
                  <div class="w-12 h-12 rounded-md bg-surface-container overflow-hidden shrink-0 border border-outline-variant/10">
                    <img
                      v-if="line.product?.images?.[0]"
                      :src="line.product.images[0]"
                      :alt="line.product?.name"
                      class="w-full h-full object-cover"
                    >
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="font-medium text-on-surface truncate">{{ line.product?.name || 'Product' }}</p>
                    <p class="text-xs text-on-surface-variant mt-0.5">
                      {{ line.quantity }} × ${{ Number(line.price).toFixed(2) }}
                    </p>
                  </div>
                  <div class="text-right shrink-0 font-medium text-on-surface">
                    ${{ (line.quantity * Number(line.price)).toFixed(2) }}
                  </div>
                </li>
              </ul>
            </div>

            <div class="flex justify-between items-center pt-2 border-t border-outline-variant/10">
              <span class="text-on-surface-variant uppercase text-[10px] tracking-[0.15em]">Total</span>
              <span class="text-lg font-semibold text-primary">
                ${{ Number(orderDetail.totalAmount).toFixed(2) }}
              </span>
            </div>

            <div
              v-if="canDeleteOrder"
              class="pt-4 border-t border-outline-variant/10"
            >
              <button
                type="button"
                class="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-error/30 bg-error/5 px-4 py-2.5 text-sm font-medium text-error hover:bg-error/10 transition-colors"
                @click="askDeleteOrder(orderDetail.id, orderDetail.id?.slice(-8).toUpperCase() || '')"
              >
                <span class="material-symbols-outlined text-lg">delete</span>
                Delete this order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete confirmation -->
    <div
      v-if="deleteConfirm.open"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-order-title"
      @click.self="cancelDeleteOrder"
    >
      <div class="bg-surface-container-lowest max-w-md w-full rounded-xl border border-outline-variant/10 shadow-xl p-6">
        <h3 id="delete-order-title" class="font-serif italic text-xl text-on-surface mb-2">
          Delete order?
        </h3>
        <p class="text-sm text-on-surface-variant font-body leading-relaxed">
          This will permanently remove order
          <span class="font-mono font-medium text-on-surface">#{{ deleteConfirm.label || '—' }}</span>
          and its line items. This cannot be undone.
        </p>
        <div class="mt-6 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            class="px-4 py-2.5 rounded-lg border border-outline-variant/30 text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors"
            :disabled="deleteSubmitting"
            @click="cancelDeleteOrder"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-4 py-2.5 rounded-lg bg-error text-on-error text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            :disabled="deleteSubmitting"
            @click="confirmDeleteOrder"
          >
            {{ deleteSubmitting ? 'Deleting…' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['permissions'],
  permission: 'VIEW_ORDERS'
})

const { data: orders, pending, error, refresh: refreshOrders } = await useApiFetch('/api/admin/orders', {
  default: () => []
})

const { hasPermission } = usePermissions()
const { toast } = useNotifications()

const canDeleteOrder = computed(() => hasPermission('UPDATE_ORDER_STATUS'))

const columns = [
  { key: 'id', label: 'Order ID' },
  { key: 'customer', label: 'Customer' },
  { key: 'items', label: 'Items' },
  { key: 'totalAmount', label: 'Total' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Date' }
] as any[]

const deleteConfirm = ref<{ open: boolean; id: string | null; label: string }>({
  open: false,
  id: null,
  label: ''
})
const deleteSubmitting = ref(false)

const askDeleteOrder = (orderId: string | undefined, shortLabel: string) => {
  if (!orderId || !canDeleteOrder.value) return
  deleteConfirm.value = { open: true, id: orderId, label: shortLabel }
}

const cancelDeleteOrder = () => {
  deleteConfirm.value = { open: false, id: null, label: '' }
}

const confirmDeleteOrder = async () => {
  const id = deleteConfirm.value.id
  if (!id) return
  deleteSubmitting.value = true
  try {
    await $apiFetch(`/api/admin/orders/${id}`, { method: 'DELETE' })
    toast.success('Order deleted')
    await refreshOrders()
    deleteConfirm.value = { open: false, id: null, label: '' }
    if (orderDetail.value?.id === id) {
      closeOrderDetail()
    }
  } catch (e: any) {
    toast.error(e?.data?.message || e?.data?.statusMessage || e?.message || 'Failed to delete order')
  } finally {
    deleteSubmitting.value = false
  }
}

const { searchQuery, filterOrders } = useSearch()
const statusFilter = ref('')

const detailModalOpen = ref(false)
const detailLoading = ref(false)
const detailError = ref<string | null>(null)
const orderDetail = ref<Record<string, any> | null>(null)

type ShippingParsed = Record<string, any> & { _raw?: string }

const SHIPPING_STRUCTURE_KEYS = [
  'firstName',
  'lastName',
  'fullName',
  'phone',
  'address',
  'city',
  'country',
  'state',
  'postalCode'
] as const

function parseShippingAddress(raw: unknown): ShippingParsed | null {
  if (raw == null) return null
  const str = String(raw).trim()
  if (!str) return null
  try {
    const o = JSON.parse(str)
    if (o && typeof o === 'object' && !Array.isArray(o)) return o as ShippingParsed
  } catch {
    return { _raw: str }
  }
  return { _raw: str }
}

const parsedShipping = computed(() => parseShippingAddress(orderDetail.value?.shippingAddress))

const shippingHasStructure = computed(() => {
  const s = parsedShipping.value
  if (!s) return false
  return SHIPPING_STRUCTURE_KEYS.some((k) => {
    const v = s[k]
    return v != null && String(v).trim() !== ''
  })
})

const shippingRecipientName = computed(() => {
  const s = parsedShipping.value
  if (!s) return ''
  const full = String(s.fullName || '').trim()
  if (full) return full
  const first = String(s.firstName || '').trim()
  const last = String(s.lastName || '').trim()
  return [first, last].filter(Boolean).join(' ').trim()
})

const shippingCityLine = computed(() => {
  const s = parsedShipping.value
  if (!s) return ''
  const city = String(s.city || '').trim()
  const state = String(s.state || '').trim()
  const postal = String(s.postalCode || '').trim()
  const country = String(s.country || '').trim()
  return [city, state, postal, country].filter((p) => p.length > 0).join(', ')
})

const openOrderDetail = async (orderId: string | undefined) => {
  if (!orderId) return
  detailModalOpen.value = true
  detailLoading.value = true
  detailError.value = null
  orderDetail.value = null
  try {
    orderDetail.value = await $apiFetch(`/api/admin/orders/${orderId}`)
  } catch (e: any) {
    detailError.value = e?.data?.message || e?.message || 'Failed to load order'
  } finally {
    detailLoading.value = false
  }
}

const closeOrderDetail = () => {
  detailModalOpen.value = false
  detailError.value = null
  orderDetail.value = null
}

const filteredOrders = computed(() => {
  if (!orders.value || !Array.isArray(orders.value)) return []

  let filtered = orders.value

  // Apply status filter
  if (statusFilter.value) {
    filtered = filtered.filter(o => o.status === statusFilter.value)
  }

  // Apply search filter
  if (searchQuery.value) {
    filtered = filterOrders(filtered, searchQuery.value)
  }

  return filtered
})

// Export to Excel function
const exportToExcel = () => {
  if (!filteredOrders.value || !Array.isArray(filteredOrders.value)) {
    alert('No orders to export')
    return
  }

  // Import xlsx library dynamically
  import('xlsx').then((XLSX) => {
    // Prepare data for export
    const exportData = filteredOrders.value.map((order) => ({
      'Order ID': order.id ? `#${order.id.slice(-8).toUpperCase()}` : 'N/A',
      'Customer': order.user?.name || 'Guest',
      'Customer Email': order.user?.email || 'N/A',
      'Total': order.totalAmount ? `$${order.totalAmount.toFixed(2)}` : '$0.00',
      'Status': order.status || 'UNKNOWN',
      'Payment Status': order.paymentStatus || 'UNKNOWN',
      'Items Count': order.items?.length || 0,
      'Date': order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'
    }))

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData)

    // Create workbook
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders')

    // Generate filename with date
    const fileName = `orders_export_${new Date().toISOString().split('T')[0]}.xlsx`

    // Download file
    XLSX.writeFile(workbook, fileName)
  }).catch((error) => {
    console.error('Failed to export:', error)
    alert('Failed to export orders. Please try again.')
  })
}
</script>
