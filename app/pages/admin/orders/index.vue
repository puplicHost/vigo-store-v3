<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-serif italic text-3xl text-on-surface mb-2">Orders</h1>
        <p class="text-on-surface-variant/70 text-sm font-body">Manage customer orders</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-4 mb-6">
      <div class="relative">
        <select
          v-model="statusFilter"
          class="appearance-none bg-white border border-outline-variant/20 rounded-lg py-2.5 pl-4 pr-10 text-sm font-body focus:outline-none focus:border-primary/50 cursor-pointer"
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
    <div class="bg-white rounded-xl border border-outline-variant/10 shadow-sm shadow-primary/5 overflow-hidden">
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
        <tbody class="divide-y divide-outline-variant/10">
          <tr v-if="pending" class="hover:bg-surface-container-low/50 transition-colors">
            <td colspan="6" class="px-6 py-12 text-center text-on-surface-variant">
              <span class="material-symbols-outlined text-3xl animate-spin">progress_activity</span>
            </td>
          </tr>
          <tr v-else-if="error" class="hover:bg-surface-container-low/50 transition-colors">
            <td colspan="6" class="px-6 py-12 text-center text-error">
              Failed to load orders
            </td>
          </tr>
          <tr v-else-if="!filteredOrders?.length" class="hover:bg-surface-container-low/50 transition-colors">
            <td colspan="6" class="px-6 py-12 text-center text-on-surface-variant font-body">
              No orders found.
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
      </table>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const { data: orders, pending, error } = await useApiFetch('/api/admin/orders')

const statusFilter = ref('')

const filteredOrders = computed(() => {
  if (!orders.value) return []
  if (!statusFilter.value) return orders.value
  return orders.value.filter(o => o.status === statusFilter.value)
})
</script>
