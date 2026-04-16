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
          <option value="PAID">Paid</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm shadow-primary/5 overflow-hidden">
      <table class="w-full">
        <thead class="bg-surface-container-low border-b border-outline-variant/10">
          <tr>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Order ID</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Customer</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Items</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Total</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Status</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Date</th>
          </tr>
        </thead>
        <ClientOnly>
          <template #fallback>
            <tbody class="divide-y divide-outline-variant/10">
              <tr class="hover:bg-surface-container-low/50 transition-colors">
                <td colspan="6" class="px-6 py-12 text-center">
                  <span class="text-on-surface-variant font-body">Loading...</span>
                </td>
              </tr>
            </tbody>
          </template>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-if="pending" class="hover:bg-surface-container-low/50 transition-colors">
              <td colspan="6" class="px-6 py-12 text-center text-on-surface-variant">
                <span class="material-symbols-outlined text-3xl animate-spin">progress_activity</span>
              </td>
            </tr>
            <tr v-else-if="error" class="hover:bg-surface-container-low/50 transition-colors">
              <td colspan="6" class="px-6 py-12 text-center">
                <span class="text-error font-body">Failed to load orders</span>
              </td>
            </tr>
            <tr v-else-if="!filteredOrders?.length" class="hover:bg-surface-container-low/50 transition-colors">
              <td colspan="6" class="px-6 py-12 text-center">
                <span class="text-on-surface-variant font-body">No orders found.</span>
              </td>
            </tr>
            <tr
              v-for="(order, index) in filteredOrders"
              :key="order.id || index"
              class="hover:bg-surface-container-low/50 transition-colors"
            >
              <td class="px-6 py-4 font-mono text-sm text-on-surface">
                #{{ order.id?.slice(-8).toUpperCase() || 'N/A' }}
              </td>
              <td class="px-6 py-4">
                <div class="font-medium text-on-surface font-body">{{ order.user?.name || 'Guest' }}</div>
                <div class="text-xs text-on-surface-variant">{{ order.user?.email }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-on-surface-variant font-body">
                {{ order.items?.length || 0 }} items
              </td>
              <td class="px-6 py-4 font-medium text-on-surface font-body">
                ${{ order.totalAmount?.toFixed(2) || '0.00' }}
              </td>
              <td class="px-6 py-4">
                <span :class="[
                  'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                  order.status === 'DELIVERED' ? 'bg-success/10 text-success' :
                  order.status === 'PAID' ? 'bg-primary/10 text-primary' :
                  order.status === 'SHIPPED' ? 'bg-warning/10 text-warning' :
                  order.status === 'CANCELLED' ? 'bg-error/10 text-error' :
                  'bg-surface-container-high text-on-surface-variant'
                ]">
                  {{ order.status || 'UNKNOWN' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-on-surface-variant font-body">
                {{ order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-' }}
              </td>
            </tr>
          </tbody>
        </ClientOnly>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['permissions'],
  permission: 'VIEW_ORDERS'
})

const { data: orders, pending, error } = await useApiFetch('/api/admin/orders', {
  default: () => []
})

const { searchQuery, filterOrders } = useSearch()
const statusFilter = ref('')

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
