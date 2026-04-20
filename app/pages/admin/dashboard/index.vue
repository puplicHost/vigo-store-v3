<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant/10 pb-6">
      <div>
        <h1 class="font-serif italic text-4xl text-on-surface mb-2">{{ $t('dashboard.title') }}</h1>
        <p class="text-on-surface-variant/70 text-sm font-body">{{ $t('dashboard.subtitle') }}</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-right rtl:text-left hidden md:block">
          <p class="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{{ $t('dashboard.lastUpdated') }}</p>
          <p class="text-sm font-medium text-on-surface font-body">{{ new Date().toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
        </div>
        <button
          v-if="auth.user.value?.role === 'SUPER_ADMIN'"
          @click="seedDatabase"
          :disabled="seeding"
          class="btn-gradient text-[#000] dark:text-[#000] px-5 py-2.5 rounded-xl font-label text-[11px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
        >
          <span v-if="seeding" class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
          <span v-else class="material-symbols-outlined text-sm">database</span>
          {{ seeding ? $t('dashboard.seeding') : $t('dashboard.seedData') }}
        </button>
      </div>
    </div>

    <!-- Quick Links Mini Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 animate-stagger mb-2">
      <NuxtLink to="/admin" class="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/50 hover:border-primary/50 transition-colors group">
         <div class="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center group-hover:scale-110 transition-transform"><span class="material-symbols-outlined text-primary-solid text-sm">inventory_2</span></div>
         <span class="text-xs font-semibold text-on-surface uppercase tracking-wider">Products</span>
      </NuxtLink>
      <NuxtLink to="/admin/categories" class="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/50 hover:border-secondary/50 transition-colors group">
         <div class="w-8 h-8 rounded-lg bg-secondary-soft flex items-center justify-center group-hover:scale-110 transition-transform"><span class="material-symbols-outlined text-secondary-solid text-sm">folder</span></div>
         <span class="text-xs font-semibold text-on-surface uppercase tracking-wider">Categories</span>
      </NuxtLink>
      <NuxtLink to="/admin/users" class="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/50 hover:border-info/50 transition-colors group">
         <div class="w-8 h-8 rounded-lg bg-info-soft flex items-center justify-center group-hover:scale-110 transition-transform"><span class="material-symbols-outlined text-info-solid text-sm">people</span></div>
         <span class="text-xs font-semibold text-on-surface uppercase tracking-wider">Users</span>
      </NuxtLink>
      <NuxtLink to="/admin/settings" class="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/50 hover:border-warning/50 transition-colors group">
         <div class="w-8 h-8 rounded-lg bg-warning-soft flex items-center justify-center group-hover:scale-110 transition-transform"><span class="material-symbols-outlined text-warning-solid text-sm">settings</span></div>
         <span class="text-xs font-semibold text-on-surface uppercase tracking-wider">Settings</span>
      </NuxtLink>
    </div>

    <!-- Main Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-stagger">
      <!-- Products -->
      <div class="card-premium p-5 flex flex-col justify-between min-h-[140px]">
        <div class="flex items-center justify-between mb-2">
          <div class="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-primary-solid text-xl">inventory_2</span>
          </div>
          <span class="text-[10px] font-bold text-success-solid bg-success-soft px-2 py-1 rounded-full border border-success/20">+12%</span>
        </div>
        <div>
          <p class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">{{ $t('dashboard.stats.totalProducts') }}</p>
          <p class="text-3xl font-bold text-on-surface font-serif italic">{{ stats.products }}</p>
        </div>
      </div>

      <!-- Categories -->
      <div class="card-premium p-5 flex flex-col justify-between min-h-[140px]">
        <div class="flex items-center justify-between mb-2">
          <div class="w-10 h-10 rounded-xl bg-secondary-soft flex items-center justify-center group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-secondary-solid text-xl">folder</span>
          </div>
        </div>
        <div>
           <p class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">Categories</p>
           <p class="text-3xl font-bold text-on-surface font-serif italic">{{ stats.categories }}</p>
        </div>
      </div>

      <!-- Orders -->
      <div class="card-premium p-5 flex flex-col justify-between min-h-[140px]">
        <div class="flex items-center justify-between mb-2">
          <div class="w-10 h-10 rounded-xl bg-warning-soft flex items-center justify-center group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-warning-solid text-xl">shopping_bag</span>
          </div>
          <span class="text-[10px] font-bold text-success-solid bg-success-soft px-2 py-1 rounded-full border border-success/20">+5%</span>
        </div>
        <div>
          <p class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">Total Orders</p>
          <p class="text-3xl font-bold text-on-surface font-serif italic">{{ stats.orders }}</p>
        </div>
      </div>

      <!-- Users -->
      <div class="card-premium p-5 flex flex-col justify-between min-h-[140px]">
        <div class="flex items-center justify-between mb-2">
          <div class="w-10 h-10 rounded-xl bg-info-soft flex items-center justify-center group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-info-solid text-xl">people</span>
          </div>
          <span class="text-[10px] font-bold text-success-solid bg-success-soft px-2 py-1 rounded-full border border-success/20">+3%</span>
        </div>
        <div>
           <p class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">Total Users</p>
           <p class="text-3xl font-bold text-on-surface font-serif italic">{{ stats.users }}</p>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Revenue Chart (Spans 2 cols) -->
      <div class="lg:col-span-2 card-premium p-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center">
              <span class="material-symbols-outlined text-primary-solid text-xl">show_chart</span>
            </div>
            <div>
              <p class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">{{ $t('dashboard.charts.revenueTrend') }}</p>
              <p class="text-sm font-bold text-on-surface font-serif italic">{{ settings.currency }}{{ stats.revenue.toFixed(2) }}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              @click="selectedPeriod = 'weekly'"
              :class="[
                'px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors',
                selectedPeriod === 'weekly' ? 'bg-primary/10 text-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              ]"
            >
              {{ $t('dashboard.charts.weekly') }}
            </button>
            <button
              @click="selectedPeriod = 'monthly'"
              :class="[
                'px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors',
                selectedPeriod === 'monthly' ? 'bg-primary/10 text-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              ]"
            >
              {{ $t('dashboard.charts.monthly') }}
            </button>
          </div>
        </div>
        <ClientOnly>
          <template #fallback>
            <div class="h-64 flex items-center justify-center">
              <span class="text-on-surface-variant font-body text-sm">{{ $t('common.loading') }}</span>
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

      <!-- Orders Chart (Donut) -->
      <div class="lg:col-span-1 card-premium p-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-warning-soft flex items-center justify-center">
              <span class="material-symbols-outlined text-warning-solid text-xl">pie_chart</span>
            </div>
            <div>
              <p class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Orders by Status</p>
              <p class="text-xs text-on-surface-variant">Current distribution</p>
            </div>
          </div>
        </div>
        <ClientOnly>
          <template #fallback>
            <div class="h-64 flex items-center justify-center">
              <span class="text-on-surface-variant text-sm">Loading chart...</span>
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
    </div>

    <!-- Bottom Row (Recent Orders & Extra Details) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Recent Orders List (Spans 2 cols) -->
      <div class="lg:col-span-2 card-premium overflow-hidden flex flex-col">
        <div class="p-6 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low/30">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center">
              <span class="material-symbols-outlined text-primary-solid">receipt_long</span>
            </div>
            <h2 class="font-serif italic text-xl text-on-surface">{{ $t('dashboard.orders.recent') }}</h2>
          </div>
          <NuxtLink to="/admin/orders" class="px-3 py-1.5 border border-primary/20 text-primary rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-primary/5 transition-colors flex items-center gap-2">
            <span>{{ $t('dashboard.orders.viewAll') }}</span>
          </NuxtLink>
        </div>
        <div class="overflow-x-auto scrollbar-custom pb-2">
          <table class="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr class="border-b border-outline-variant/10 bg-surface-container-low/30">
                <th class="px-6 py-3 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant whitespace-nowrap">{{ $t('dashboard.orders.orderId') }}</th>
                <th class="px-6 py-3 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant whitespace-nowrap">{{ $t('dashboard.orders.customer') }}</th>
                <th class="px-6 py-3 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant whitespace-nowrap">{{ $t('dashboard.orders.total') }}</th>
                <th class="px-6 py-3 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant whitespace-nowrap">{{ $t('dashboard.orders.status') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="pending" class="animate-pulse">
                <td colspan="4" class="px-6 py-8 text-center text-on-surface-variant">
                  <span class="material-symbols-outlined animate-spin text-2xl mb-2">progress_activity</span>
                  <p class="text-sm">Loading recent orders...</p>
                </td>
              </tr>
              <tr v-else-if="!recentOrders?.length" class="hover:bg-surface-container-low/50 transition-colors">
                <td colspan="4" class="px-6 py-8 text-center text-on-surface-variant font-body">
                  No orders yet.
                </td>
              </tr>
              <template v-else>
                <tr
                  v-for="(order, index) in recentOrders.slice(0, 5)"
                  :key="order.id || index"
                  class="hover:bg-primary/5 transition-colors border-b border-outline-variant/5 last:border-0"
                >
                  <td class="px-6 py-4 font-mono text-xs text-primary-solid font-medium">
                    #{{ order.id?.slice(-8).toUpperCase() || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 text-sm text-on-surface font-body">
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center">
                        <span class="material-symbols-outlined text-on-surface-variant text-[10px]">person</span>
                      </div>
                      {{ order.user?.name || 'Guest' }}
                    </div>
                  </td>
                  <td class="px-6 py-4 font-bold text-on-surface font-body text-sm">
                    {{ settings.currency }}{{ order.totalAmount?.toFixed(2) || '0.00' }}
                  </td>
                  <td class="px-6 py-4">
                    <span :class="[
                      'inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider',
                      order.status === 'DELIVERED' ? 'bg-success-soft text-success-solid' :
                      order.status === 'PAID' ? 'bg-primary-soft text-primary-solid' :
                      order.status === 'SHIPPED' ? 'bg-warning-soft text-warning-solid' :
                      order.status === 'CANCELLED' ? 'bg-error-soft text-error-solid' :
                      'bg-surface-container-high text-on-surface-variant'
                    ]">
                      {{ order.status || 'UNKNOWN' }}
                    </span>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right Column -->
      <div class="lg:col-span-1 space-y-6">

        <!-- Revenue Details Mini Card -->
        <div class="card-premium p-6">
          <p class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-4">Financial Overview</p>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-success-soft flex items-center justify-center">
                  <span class="material-symbols-outlined text-success-solid text-sm">payments</span>
                </div>
                <span class="text-sm font-semibold text-on-surface">Paid Orders</span>
              </div>
              <span class="text-sm font-bold text-on-surface">{{ stats.paidOrders }}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-warning-soft flex items-center justify-center">
                  <span class="material-symbols-outlined text-warning-solid text-sm">pending_actions</span>
                </div>
                <span class="text-sm font-semibold text-on-surface">Pending</span>
              </div>
              <span class="text-sm font-bold text-on-surface">{{ stats.pendingOrders }}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center">
                  <span class="material-symbols-outlined text-primary-solid text-sm">calculate</span>
                </div>
                <span class="text-xs font-semibold text-on-surface">Avg Order Value</span>
              </div>
              <span class="text-sm font-bold text-on-surface">{{ settings.currency }}{{ stats.averageOrderValue.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Low Stock Alerts -->
        <div v-if="lowStockProducts.length > 0" class="card-premium p-6 border-error/30 bg-gradient-to-br from-error/5 to-surface-container-lowest">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-8 h-8 rounded-lg bg-error-soft flex items-center justify-center animate-pulse">
              <span class="material-symbols-outlined text-error-solid text-sm">warning</span>
            </div>
            <div>
              <h3 class="font-bold text-error-solid text-sm">{{ $t('dashboard.alerts.lowStock') }}</h3>
              <p class="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">{{ lowStockProducts.length }} {{ $t('dashboard.alerts.productsLeft') }}</p>
            </div>
          </div>
          <div class="space-y-3 max-h-48 overflow-y-auto scrollbar-custom pr-2">
            <div v-for="product in lowStockProducts.slice(0, 5)" :key="product.id" class="flex items-center justify-between border-b border-error/10 pb-2 last:border-0 last:pb-0">
              <div>
                <p class="text-xs font-semibold text-on-surface truncate max-w-[150px]">{{ product.name }}</p>
                <p class="text-[10px] text-error font-medium">{{ product.stock }} {{ $t('products.units') }}</p>
              </div>
              <NuxtLink :to="`/admin/products/${product.id}/edit`" class="text-[10px] font-bold text-error uppercase hover:underline">
                {{ $t('dashboard.alerts.restock') }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['permissions'],
  permission: 'VIEW_PRODUCTS',
  ssr: false // Disable SSR to prevent IPC Connection Closed error
})

import VueApexCharts from 'vue3-apexcharts'

const { settings } = useSettings()
const auth = useAuth()
const { locale, t } = useI18n()
const { isDark } = useTheme()
const { toast } = useNotifications()

const seeding = ref(false)

const seedDatabase = async () => {
  seeding.value = true
  try {
    const response = await $apiFetch('/api/admin/seed', {
      method: 'POST'
    })
    toast.success('Database seeded successfully!')
    await refreshAllData()
  } catch (error: any) {
    console.error('Seed error:', error)
    toast.error('Failed to seed database: ' + (error.data?.statusMessage || error.message))
  } finally {
    seeding.value = false
  }
}

// Use new aggregated dashboard endpoint
const { data: dashboardData, pending, refresh: refreshDashboard } = await useApiFetch('/api/admin/dashboard', {
  default: () => ({
    stats: {
      products: 0,
      categories: 0,
      orders: 0,
      users: 0,
      revenue: 0,
      paidOrders: 0,
      pendingOrders: 0,
      averageOrderValue: 0,
      adminUsers: 0,
      customerUsers: 0,
      staffUsers: 0
    },
    recentOrders: [],
    lowStockProducts: []
  })
})

// Keep separate orders fetch for chart data (needs full order history for time series)
const { data: orders, refresh: refreshOrders } = await useApiFetch('/api/admin/orders', {
  default: () => []
})

// Refresh all data function
const refreshAllData = () => {
  refreshDashboard()
  refreshOrders()
}

// Revenue chart period state
const selectedPeriod = ref<'weekly' | 'monthly'>('weekly')

const stats = computed(() => dashboardData.value?.stats || {
  products: 0,
  categories: 0,
  orders: 0,
  users: 0,
  revenue: 0,
  paidOrders: 0,
  pendingOrders: 0,
  averageOrderValue: 0,
  adminUsers: 0,
  customerUsers: 0,
  staffUsers: 0
})

const recentOrders = computed(() => dashboardData.value?.recentOrders || [])

const lowStockProducts = computed(() => dashboardData.value?.lowStockProducts || [])

// Revenue Chart Data
const revenueChartSeries = computed(() => {
  const ordersArray = Array.isArray(orders.value) ? orders.value : []
  const paidOrders = ordersArray.filter(o => o.paymentStatus === 'PAID')

  // Determine period
  const days = selectedPeriod.value === 'weekly' ? 7 : 30

  // Group by selected period
  const periodDays = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    periodDays.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
      timestamp: date
    })
  }

  const revenueByDay = periodDays.map(day => {
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
    height: 256,
    foreColor: isDark.value ? '#94a3b8' : '#64748b'
  },
  series: revenueChartSeries.value,
  xaxis: {
    categories: (() => {
      const days = selectedPeriod.value === 'weekly' ? 7 : 30
      const periodDays = []
      const now = new Date()
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        periodDays.push(date.toLocaleDateString(locale.value === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'short', day: 'numeric' }))
      }
      return periodDays
    })(),
    labels: {
      style: {
        colors: isDark.value ? '#94a3b8' : '#64748b',
        fontSize: '12px'
      }
    },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: {
      style: {
        colors: isDark.value ? '#94a3b8' : '#64748b',
        fontSize: '12px'
      },
      formatter: (value: number) => `${settings.value.currency}${value.toFixed(0)}`
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
    borderColor: isDark.value ? '#1e293b' : '#f1f5f9',
    strokeDashArray: 4,
    yaxis: {
      lines: { show: true }
    },
    xaxis: {
      lines: { show: false }
    }
  },
  tooltip: {
    theme: isDark.value ? 'dark' : 'light',
    y: {
      formatter: (value: number) => `${settings.value.currency}${value.toFixed(2)}`
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
    height: 256,
    foreColor: isDark.value ? '#94a3b8' : '#64748b'
  },
  series: ordersChartSeries.value,
  labels: [t('dashboard.orders.pending'), t('dashboard.orders.paid'), t('dashboard.orders.shipped'), t('dashboard.orders.delivered'), t('dashboard.orders.cancelled')],
  colors: ['#f59e0b', '#10b981', '#6366f1', '#3b82f6', '#ef4444'],
  dataLabels: {
    enabled: true,
    formatter: (val: number) => val.toString()
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
      colors: isDark.value ? '#94a3b8' : '#64748b'
    }
  },
  tooltip: {
    theme: isDark.value ? 'dark' : 'light',
    y: {
      formatter: (value: number) => `${value} ${t('dashboard.orders.recent')}`
    }
  }
}))
</script>
