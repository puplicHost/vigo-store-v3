<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="font-serif italic text-3xl text-on-surface mb-2">Dashboard</h1>
      <p class="text-on-surface-variant/70 text-sm font-body">Overview of your store performance</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Products -->
      <div class="bg-white rounded-xl border border-outline-variant/10 p-6 shadow-sm shadow-primary/5">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <span class="material-symbols-outlined text-primary text-2xl">inventory_2</span>
          </div>
          <span class="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">+12%</span>
        </div>
        <p class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">Total Products</p>
        <p class="text-3xl font-serif italic text-on-surface">{{ stats.products }}</p>
      </div>

      <!-- Categories -->
      <div class="bg-white rounded-xl border border-outline-variant/10 p-6 shadow-sm shadow-primary/5">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center">
            <span class="material-symbols-outlined text-on-secondary text-2xl">folder</span>
          </div>
        </div>
        <p class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">Categories</p>
        <p class="text-3xl font-serif italic text-on-surface">{{ stats.categories }}</p>
      </div>

      <!-- Orders -->
      <div class="bg-white rounded-xl border border-outline-variant/10 p-6 shadow-sm shadow-primary/5">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
            <span class="material-symbols-outlined text-warning text-2xl">shopping_bag</span>
          </div>
          <span class="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">+5%</span>
        </div>
        <p class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">Total Orders</p>
        <p class="text-3xl font-serif italic text-on-surface">{{ stats.orders }}</p>
      </div>

      <!-- Revenue -->
      <div class="bg-white rounded-xl border border-outline-variant/10 p-6 shadow-sm shadow-primary/5">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
            <span class="material-symbols-outlined text-success text-2xl">payments</span>
          </div>
          <span class="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">+8%</span>
        </div>
        <p class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">Revenue</p>
        <p class="text-3xl font-serif italic text-on-surface">${{ stats.revenue.toFixed(0) }}</p>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="bg-white rounded-xl border border-outline-variant/10 shadow-sm shadow-primary/5 overflow-hidden">
      <div class="p-6 border-b border-outline-variant/10 flex items-center justify-between">
        <h2 class="font-serif italic text-xl text-on-surface">Recent Orders</h2>
        <NuxtLink to="/admin/orders" class="text-primary font-label text-[11px] uppercase tracking-[0.15em] hover:underline">
          View All
        </NuxtLink>
      </div>
      <table class="w-full">
        <thead class="bg-surface-container-low">
          <tr>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Order</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Customer</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Total</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-outline-variant/10">
          <tr v-if="pending" class="hover:bg-surface-container-low/50 transition-colors">
            <td colspan="4" class="px-6 py-8 text-center text-on-surface-variant">
              <span class="material-symbols-outlined text-2xl animate-spin">progress_activity</span>
            </td>
          </tr>
          <tr v-else-if="!recentOrders?.length" class="hover:bg-surface-container-low/50 transition-colors">
            <td colspan="4" class="px-6 py-8 text-center text-on-surface-variant font-body">
              No orders yet.
            </td>
          </tr>
          <tr
            v-for="(order, index) in recentOrders"
            :key="order.id || index"
            class="hover:bg-surface-container-low/50 transition-colors"
          >
            <td class="px-6 py-4 font-mono text-sm text-on-surface">
              #{{ order.id?.slice(-8).toUpperCase() || 'N/A' }}
            </td>
            <td class="px-6 py-4 text-sm text-on-surface font-body">
              {{ order.user?.name || 'Guest' }}
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
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Quick Links -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <NuxtLink to="/admin" class="bg-white rounded-xl border border-outline-variant/10 p-6 shadow-sm shadow-primary/5 hover:border-primary/30 transition-colors group">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <span class="material-symbols-outlined text-primary">inventory_2</span>
          </div>
          <div>
            <p class="font-medium text-on-surface font-body">Manage Products</p>
            <p class="text-xs text-on-surface-variant">Add, edit, or remove products</p>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink to="/categories" class="bg-white rounded-xl border border-outline-variant/10 p-6 shadow-sm shadow-primary/5 hover:border-primary/30 transition-colors group">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center group-hover:bg-secondary transition-colors">
            <span class="material-symbols-outlined text-on-secondary">folder</span>
          </div>
          <div>
            <p class="font-medium text-on-surface font-body">Manage Categories</p>
            <p class="text-xs text-on-surface-variant">Organize your catalog</p>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink to="/admin/orders" class="bg-white rounded-xl border border-outline-variant/10 p-6 shadow-sm shadow-primary/5 hover:border-primary/30 transition-colors group">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center group-hover:bg-warning/20 transition-colors">
            <span class="material-symbols-outlined text-warning">shopping_bag</span>
          </div>
          <div>
            <p class="font-medium text-on-surface font-body">View Orders</p>
            <p class="text-xs text-on-surface-variant">Check customer orders</p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const { token } = useAuth()

const headers = computed(() => ({
  Authorization: token.value ? `Bearer ${token.value}` : ''
}))

const { data: products } = await useFetch('/api/admin/products', { headers })
const { data: categories } = await useFetch('/api/admin/categories', { headers })
const { data: orders, pending } = await useFetch('/api/admin/orders', { headers })

const stats = computed(() => ({
  products: products.value?.length || 0,
  categories: categories.value?.length || 0,
  orders: orders.value?.length || 0,
  revenue: orders.value?.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0
}))

const recentOrders = computed(() => {
  if (!orders.value) return []
  return orders.value.slice(0, 5)
})
</script>
