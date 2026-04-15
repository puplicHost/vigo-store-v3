<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="font-serif italic text-4xl text-on-surface mb-2">Dashboard</h1>
          <p class="text-on-surface-variant/70 text-sm font-body">Overview of your store performance</p>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-xs text-on-surface-variant font-body">Last updated</p>
            <p class="text-sm font-medium text-on-surface font-body">{{ new Date().toLocaleDateString() }}</p>
          </div>
          <button
            v-if="auth.user.value?.role === 'SUPER_ADMIN'"
            @click="seedDatabase"
            :disabled="seeding"
            class="bg-primary text-white px-4 py-2 rounded-lg font-body text-sm hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <span v-if="seeding" class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
            <span v-else class="material-symbols-outlined text-sm">database</span>
            {{ seeding ? 'Seeding...' : 'Seed Data' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Products -->
      <div class="bg-gradient-to-br from-white to-primary/5 rounded-2xl border border-primary/10 p-6 shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 group">
        <div class="flex items-center justify-between mb-4">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-white text-2xl">inventory_2</span>
          </div>
          <span class="text-xs font-semibold text-success bg-success/10 px-3 py-1.5 rounded-full border border-success/20">+12%</span>
        </div>
        <p class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">Total Products</p>
        <p class="text-4xl font-bold text-on-surface">{{ stats.products }}</p>
        <div class="mt-3 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full" style="width: 75%"></div>
        </div>
      </div>

      <!-- Categories -->
      <div class="bg-gradient-to-br from-white to-secondary/5 rounded-2xl border border-secondary/10 p-6 shadow-lg shadow-secondary/10 hover:shadow-xl hover:shadow-secondary/20 transition-all duration-300 group">
        <div class="flex items-center justify-between mb-4">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-lg shadow-secondary/20 group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-white text-2xl">folder</span>
          </div>
        </div>
        <p class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">Categories</p>
        <p class="text-4xl font-bold text-on-surface">{{ stats.categories }}</p>
        <div class="mt-3 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-secondary to-secondary/60 rounded-full" style="width: 60%"></div>
        </div>
      </div>

      <!-- Orders -->
      <div class="bg-gradient-to-br from-white to-warning/5 rounded-2xl border border-warning/10 p-6 shadow-lg shadow-warning/10 hover:shadow-xl hover:shadow-warning/20 transition-all duration-300 group">
        <div class="flex items-center justify-between mb-4">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-warning to-warning/80 flex items-center justify-center shadow-lg shadow-warning/20 group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-white text-2xl">shopping_bag</span>
          </div>
          <span class="text-xs font-semibold text-success bg-success/10 px-3 py-1.5 rounded-full border border-success/20">+5%</span>
        </div>
        <p class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">Total Orders</p>
        <p class="text-4xl font-bold text-on-surface">{{ stats.orders }}</p>
        <div class="mt-3 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-warning to-warning/60 rounded-full" style="width: 85%"></div>
        </div>
      </div>

      <!-- Users -->
      <div class="bg-gradient-to-br from-white to-info/5 rounded-2xl border border-info/10 p-6 shadow-lg shadow-info/10 hover:shadow-xl hover:shadow-info/20 transition-all duration-300 group">
        <div class="flex items-center justify-between mb-4">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-info to-info/80 flex items-center justify-center shadow-lg shadow-info/20 group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-white text-2xl">people</span>
          </div>
          <span class="text-xs font-semibold text-success bg-success/10 px-3 py-1.5 rounded-full border border-success/20">+3%</span>
        </div>
        <p class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">Total Users</p>
        <p class="text-4xl font-bold text-on-surface">{{ stats.users }}</p>
        <div class="mt-3 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-info to-info/60 rounded-full" style="width: 90%"></div>
        </div>
      </div>
    </div>

    <!-- Low Stock Alert -->
    <div v-if="lowStockProducts.length > 0" class="bg-gradient-to-r from-error/10 to-error/5 border border-error/30 rounded-2xl p-6 mb-8 shadow-lg shadow-error/10">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-error to-error/80 flex items-center justify-center shadow-lg shadow-error/20 animate-pulse">
          <span class="material-symbols-outlined text-white text-2xl">warning</span>
        </div>
        <div>
          <h3 class="font-semibold text-error font-body text-lg">Low Stock Alert</h3>
          <p class="text-sm text-error/80">{{ lowStockProducts.length }} product(s) running low on stock</p>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div v-for="product in lowStockProducts.slice(0, 6)" :key="product.id" class="flex items-center justify-between bg-white rounded-xl p-4 border border-error/10 hover:border-error/30 transition-colors">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-lg bg-error/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-error text-lg">inventory_2</span>
            </div>
            <div>
              <p class="text-sm font-semibold text-on-surface">{{ product.name }}</p>
              <p class="text-xs text-error font-medium">{{ product.stock }} left</p>
            </div>
          </div>
          <NuxtLink :to="`/admin/products/${product.id}/edit`" class="px-3 py-2 bg-error text-white rounded-lg text-xs font-semibold hover:bg-error/90 transition-colors">
            Restock
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Revenue Chart -->
    <div class="bg-gradient-to-br from-white to-surface-container-low rounded-2xl border border-outline-variant/10 shadow-lg shadow-primary/10 p-6 mb-8">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
            <span class="material-symbols-outlined text-white text-2xl">show_chart</span>
          </div>
          <div>
            <p class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Revenue Trend</p>
            <p class="text-sm text-on-surface-variant">Last 7 days</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">Weekly</button>
          <button class="px-3 py-1.5 text-xs font-medium bg-surface-container-low text-on-surface-variant rounded-lg hover:bg-surface-container-high transition-colors">Monthly</button>
        </div>
      </div>
      <ClientOnly>
        <template #fallback>
          <div class="h-64 flex items-center justify-center">
            <span class="text-on-surface-variant">Loading chart...</span>
          </div>
        </template>
        <div class="h-64">
          <VueApexCharts
            type="area"
            :options="revenueChartOptions"
            :series="revenueChartSeries"
            height="256"
          />
        </div>
      </ClientOnly>
    </div>

    <!-- Orders Chart -->
    <div class="bg-gradient-to-br from-white to-surface-container-low rounded-2xl border border-outline-variant/10 shadow-lg shadow-primary/10 p-6 mb-8">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-warning to-warning/80 flex items-center justify-center shadow-lg shadow-warning/20">
            <span class="material-symbols-outlined text-white text-2xl">bar_chart</span>
          </div>
          <div>
            <p class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Orders by Status</p>
            <p class="text-sm text-on-surface-variant">Current distribution</p>
          </div>
        </div>
      </div>
      <ClientOnly>
        <template #fallback>
          <div class="h-64 flex items-center justify-center">
            <span class="text-on-surface-variant">Loading chart...</span>
          </div>
        </template>
        <div class="h-64">
          <VueApexCharts
            type="donut"
            :options="ordersChartOptions"
            :series="ordersChartSeries"
            height="256"
          />
        </div>
      </ClientOnly>
    </div>

    <!-- Revenue & Quick Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Revenue Card -->
      <div class="bg-gradient-to-br from-success/5 to-success/10 rounded-2xl border border-success/20 p-6 shadow-lg shadow-success/10">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-success to-success/80 flex items-center justify-center shadow-lg shadow-success/20">
              <span class="material-symbols-outlined text-white text-2xl">payments</span>
            </div>
            <div>
              <p class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Total Revenue</p>
              <p class="text-4xl font-bold text-on-surface">{{ settings.currency }}{{ stats.revenue.toFixed(2) }}</p>
            </div>
          </div>
          <span class="text-xs font-semibold text-success bg-success/10 px-3 py-1.5 rounded-full border border-success/20">+8%</span>
        </div>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-white rounded-lg">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-success"></div>
              <span class="text-sm text-on-surface-variant">Paid Orders</span>
            </div>
            <span class="text-sm font-bold text-on-surface">{{ stats.paidOrders }}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-white rounded-lg">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-warning"></div>
              <span class="text-sm text-on-surface-variant">Pending Orders</span>
            </div>
            <span class="text-sm font-bold text-on-surface">{{ stats.pendingOrders }}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-white rounded-lg">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-primary"></div>
              <span class="text-sm text-on-surface-variant">Average Order Value</span>
            </div>
            <span class="text-sm font-bold text-on-surface">{{ settings.currency }}{{ stats.averageOrderValue.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- User Distribution -->
      <div class="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20 p-6 shadow-lg shadow-primary/10">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
            <span class="material-symbols-outlined text-white text-2xl">pie_chart</span>
          </div>
          <div>
            <p class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">User Distribution</p>
            <p class="text-sm text-on-surface-variant">By Role</p>
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-primary"></div>
                <span class="text-sm font-medium text-on-surface">Admins</span>
              </div>
              <span class="text-sm font-bold text-on-surface">{{ stats.adminUsers }}</span>
            </div>
            <div class="h-2 bg-surface-container-low rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full" :style="{ width: `${(stats.adminUsers / stats.users) * 100}%` }"></div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-success"></div>
                <span class="text-sm font-medium text-on-surface">Customers</span>
              </div>
              <span class="text-sm font-bold text-on-surface">{{ stats.customerUsers }}</span>
            </div>
            <div class="h-2 bg-surface-container-low rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-success to-success/60 rounded-full" :style="{ width: `${(stats.customerUsers / stats.users) * 100}%` }"></div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-warning"></div>
                <span class="text-sm font-medium text-on-surface">Staff</span>
              </div>
              <span class="text-sm font-bold text-on-surface">{{ stats.staffUsers }}</span>
            </div>
            <div class="h-2 bg-surface-container-low rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-warning to-warning/60 rounded-full" :style="{ width: `${(stats.staffUsers / stats.users) * 100}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="bg-gradient-to-br from-white to-surface-container-low rounded-2xl border border-outline-variant/10 shadow-lg shadow-primary/10 overflow-hidden">
      <div class="p-6 border-b border-outline-variant/10 flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
            <span class="material-symbols-outlined text-white">shopping_bag</span>
          </div>
          <h2 class="font-serif italic text-xl text-on-surface">Recent Orders</h2>
        </div>
        <NuxtLink to="/admin/orders" class="px-4 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
          <span>View All</span>
          <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </NuxtLink>
      </div>
      <table class="w-full">
        <thead class="bg-surface-container-low/50">
          <tr>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Order ID</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Customer</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Total</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Status</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Payment</th>
          </tr>
        </thead>
        <ClientOnly>
          <template #fallback>
            <tbody class="divide-y divide-outline-variant/10">
              <tr class="hover:bg-surface-container-low/50 transition-colors">
                <td colspan="5" class="px-6 py-8 text-center">
                  <span class="text-on-surface-variant font-body">Loading...</span>
                </td>
              </tr>
            </tbody>
          </template>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-if="pending" class="hover:bg-surface-container-low/50 transition-colors">
              <td colspan="5" class="px-6 py-8 text-center text-on-surface-variant">
                <span class="material-symbols-outlined text-2xl animate-spin">progress_activity</span>
              </td>
            </tr>
            <tr v-else-if="!recentOrders?.length" class="hover:bg-surface-container-low/50 transition-colors">
              <td colspan="5" class="px-6 py-8 text-center text-on-surface-variant font-body">
                No orders yet.
              </td>
            </tr>
            <tr
              v-for="(order, index) in recentOrders"
              :key="order.id || index"
              class="hover:bg-primary/5 transition-colors"
            >
              <td class="px-6 py-4 font-mono text-sm text-primary font-medium">
                #{{ order.id?.slice(-8).toUpperCase() || 'N/A' }}
              </td>
              <td class="px-6 py-4 text-sm text-on-surface font-body">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center">
                    <span class="material-symbols-outlined text-on-surface-variant text-sm">person</span>
                  </div>
                  {{ order.user?.name || 'Guest' }}
                </div>
              </td>
              <td class="px-6 py-4 font-bold text-on-surface font-body">
                {{ settings.currency }}{{ order.totalAmount?.toFixed(2) || '0.00' }}
              </td>
              <td class="px-6 py-4">
                <span :class="[
                  'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border',
                  order.status === 'DELIVERED' ? 'bg-success/10 text-success border-success/20' :
                  order.status === 'PAID' ? 'bg-primary/10 text-primary border-primary/20' :
                  order.status === 'SHIPPED' ? 'bg-warning/10 text-warning border-warning/20' :
                  order.status === 'CANCELLED' ? 'bg-error/10 text-error border-error/20' :
                  'bg-surface-container-high text-on-surface-variant border-outline-variant/20'
                ]">
                  {{ order.status || 'UNKNOWN' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="[
                  'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border',
                  order.paymentStatus === 'PAID' ? 'bg-success/10 text-success border-success/20' :
                  order.paymentStatus === 'PENDING' ? 'bg-warning/10 text-warning border-warning/20' :
                  order.paymentStatus === 'FAILED' ? 'bg-error/10 text-error border-error/20' :
                  'bg-surface-container-high text-on-surface-variant border-outline-variant/20'
                ]">
                  {{ order.paymentStatus || 'UNKNOWN' }}
                </span>
              </td>
            </tr>
          </tbody>
        </ClientOnly>
      </table>
    </div>

    <!-- Quick Links -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      <NuxtLink to="/admin" class="bg-gradient-to-br from-white to-primary/5 rounded-2xl border border-primary/10 p-6 shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 group">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-white text-xl">inventory_2</span>
          </div>
          <div>
            <p class="font-semibold text-on-surface font-body">Manage Products</p>
            <p class="text-xs text-on-surface-variant">Add, edit, or remove products</p>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink to="/categories" class="bg-gradient-to-br from-white to-secondary/5 rounded-2xl border border-secondary/10 p-6 shadow-lg shadow-secondary/10 hover:shadow-xl hover:shadow-secondary/20 transition-all duration-300 group">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-lg shadow-secondary/20 group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-white text-xl">folder</span>
          </div>
          <div>
            <p class="font-semibold text-on-surface font-body">Manage Categories</p>
            <p class="text-xs text-on-surface-variant">Organize your catalog</p>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink to="/admin/users" class="bg-gradient-to-br from-white to-info/5 rounded-2xl border border-info/10 p-6 shadow-lg shadow-info/10 hover:shadow-xl hover:shadow-info/20 transition-all duration-300 group">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-info to-info/80 flex items-center justify-center shadow-lg shadow-info/20 group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-white text-xl">people</span>
          </div>
          <div>
            <p class="font-semibold text-on-surface font-body">Manage Users</p>
            <p class="text-xs text-on-surface-variant">Admin, staff & customers</p>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink to="/admin/settings" class="bg-gradient-to-br from-white to-warning/5 rounded-2xl border border-warning/10 p-6 shadow-lg shadow-warning/10 hover:shadow-xl hover:shadow-warning/20 transition-all duration-300 group">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-warning to-warning/80 flex items-center justify-center shadow-lg shadow-warning/20 group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-white text-xl">settings</span>
          </div>
          <div>
            <p class="font-semibold text-on-surface font-body">Store Settings</p>
            <p class="text-xs text-on-surface-variant">Configure your store</p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['permissions'],
  permission: 'VIEW_PRODUCTS'
})

import VueApexCharts from 'vue3-apexcharts'

const { settings } = useSettings()
const auth = useAuth()

const seeding = ref(false)

const seedDatabase = async () => {
  seeding.value = true
  try {
    const response = await $fetch('/api/admin/seed', {
      method: 'POST'
    })
    alert('Database seeded successfully!')
    // Refresh the page to see new data
    window.location.reload()
  } catch (error) {
    console.error('Seed error:', error)
    alert('Failed to seed database: ' + (error.data?.statusMessage || error.message))
  } finally {
    seeding.value = false
  }
}

const { data: products } = await useApiFetch('/api/admin/products', {
  default: () => []
})
const { data: categories } = await useApiFetch('/api/admin/categories', {
  default: () => []
})
const { data: orders, pending } = await useApiFetch('/api/admin/orders', {
  default: () => []
})
const { data: users } = await useApiFetch('/api/admin/users', {
  default: () => []
})

const stats = computed(() => {
  const ordersArray = Array.isArray(orders.value) ? orders.value : []
  const usersArray = Array.isArray(users.value) ? users.value : []

  // Only count paid orders for revenue calculation
  const paidOrdersArray = ordersArray.filter(o => o.paymentStatus === 'PAID')
  const pendingOrdersArray = ordersArray.filter(o => o.paymentStatus === 'PENDING')

  const paidOrders = paidOrdersArray.length
  const pendingOrders = pendingOrdersArray.length
  const adminUsers = usersArray.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length
  const customerUsers = usersArray.filter(u => u.role === 'USER').length
  const staffUsers = usersArray.filter(u => u.role === 'SALES' || u.role === 'MANAGER').length

  return {
    products: products.value?.length || 0,
    categories: categories.value?.length || 0,
    orders: ordersArray.length || 0,
    users: usersArray.length || 0,
    revenue: paidOrdersArray.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0,
    paidOrders,
    pendingOrders,
    averageOrderValue: paidOrdersArray.length > 0 ? (paidOrdersArray.reduce((sum, o) => sum + (o.totalAmount || 0), 0) / paidOrdersArray.length) : 0,
    adminUsers,
    customerUsers,
    staffUsers
  }
})

const recentOrders = computed(() => {
  const ordersArray = Array.isArray(orders.value) ? orders.value : []
  return ordersArray.slice(0, 5)
})

const lowStockProducts = computed(() => {
  const productsArray = Array.isArray(products.value) ? products.value : []
  return productsArray.filter(p => p.stock < 10).sort((a, b) => a.stock - b.stock)
})

// Revenue Chart Data
const revenueChartSeries = computed(() => {
  const ordersArray = Array.isArray(orders.value) ? orders.value : []
  const paidOrders = ordersArray.filter(o => o.paymentStatus === 'PAID')

  // Group by last 7 days
  const last7Days = []
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    last7Days.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
      timestamp: date
    })
  }

  const revenueByDay = last7Days.map(day => {
    const dayRevenue = paidOrders
      .filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate.toDateString() === day.timestamp.toDateString()
      })
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
    return dayRevenue
  })

  return [{
    name: 'Revenue',
    data: revenueByDay
  }]
})

const revenueChartOptions = computed(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif',
    height: 256
  },
  series: revenueChartSeries.value,
  xaxis: {
    categories: (() => {
      const last7Days = []
      const now = new Date()
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        last7Days.push(date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }))
      }
      return last7Days
    })(),
    labels: {
      style: {
        colors: '#64748b',
        fontSize: '12px'
      }
    },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: {
      style: {
        colors: '#64748b',
        fontSize: '12px'
      },
      formatter: (value) => `${settings.value.currency}${value.toFixed(0)}`
    }
  },
  colors: ['#6366f1'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.1,
      stops: [0, 90, 100]
    }
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    borderColor: '#f1f5f9',
    strokeDashArray: 4,
    yaxis: {
      lines: { show: true }
    },
    xaxis: {
      lines: { show: false }
    }
  },
  tooltip: {
    theme: 'light',
    y: {
      formatter: (value) => `${settings.value.currency}${value.toFixed(2)}`
    }
  }
}))

// Orders Chart Data
const ordersChartSeries = computed(() => {
  const ordersArray = Array.isArray(orders.value) ? orders.value : []

  const pendingCount = ordersArray.filter(o => o.status === 'PENDING').length
  const paidCount = ordersArray.filter(o => o.status === 'PAID').length
  const shippedCount = ordersArray.filter(o => o.status === 'SHIPPED').length
  const deliveredCount = ordersArray.filter(o => o.status === 'DELIVERED').length
  const cancelledCount = ordersArray.filter(o => o.status === 'CANCELLED').length

  return [pendingCount, paidCount, shippedCount, deliveredCount, cancelledCount]
})

const ordersChartOptions = computed(() => ({
  chart: {
    type: 'donut',
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif',
    height: 256
  },
  series: ordersChartSeries.value,
  labels: ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'],
  colors: ['#f59e0b', '#10b981', '#6366f1', '#3b82f6', '#ef4444'],
  dataLabels: {
    enabled: true,
    formatter: (val) => val.toString()
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%'
      }
    }
  },
  legend: {
    position: 'bottom',
    fontSize: '12px',
    labels: {
      colors: '#64748b'
    }
  },
  tooltip: {
    theme: 'light',
    y: {
      formatter: (value) => `${value} orders`
    }
  }
}))
</script>
