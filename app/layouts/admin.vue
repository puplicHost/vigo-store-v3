<template>
  <div class="min-h-screen bg-surface flex transition-colors duration-300">
    <!-- Sidebar -->
    <aside class="w-64 bg-surface-container-lowest border-r border-outline-variant flex flex-col transition-colors duration-300">
      <!-- Logo -->
      <div class="p-8 border-b border-outline-variant/10">
        <h1 class="font-serif italic text-2xl tracking-[0.15em] text-on-surface">
          {{ settings?.siteName || 'THE ATELIER' }}
        </h1>
        <p class="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mt-1">
          Management
        </p>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-6 space-y-2">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300',
            isActive(item.path)
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
          ]"
        >
          <span class="material-symbols-outlined text-lg">{{ item.icon }}</span>
          <span class="font-label text-[11px] uppercase tracking-[0.15em]">{{ $t(item.name) }}</span>
        </NuxtLink>
      </nav>

      <!-- Bottom Actions -->
      <div class="p-6 border-t border-outline-variant/10">
        <button
          @click="logout"
          class="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-on-surface-variant hover:bg-error/10 hover:text-error transition-all duration-300"
        >
          <span class="material-symbols-outlined text-lg">logout</span>
          <span class="font-label text-[11px] uppercase tracking-[0.15em]">{{ $t('sidebar.signOut') }}</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Top Bar -->
      <header class="h-16 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-8 transition-colors duration-300">
        <!-- Search -->
        <div class="flex-1 max-w-md">
          <div class="relative group">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">
              search
            </span>
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('topbar.search')"
              class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg py-2.5 pl-10 pr-4 text-sm font-body focus:outline-none focus:border-primary/50 transition-all duration-300"
            />
          </div>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-4">
          <!-- Language Toggle -->
          <button 
            @click="toggleLocale" 
            class="px-3 py-2 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant text-[10px] font-bold uppercase tracking-widest"
            :title="locale === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'"
          >
            {{ locale === 'en' ? 'عربي' : 'EN' }}
          </button>
          <!-- Theme Toggle -->
          <button 
            @click="toggleTheme" 
            class="p-2 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant flex items-center justify-center"
            :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          >
            <span class="material-symbols-outlined text-xl">
              {{ isDark ? 'light_mode' : 'dark_mode' }}
            </span>
          </button>

          <!-- Notifications -->
          <div class="relative">
            <button 
              @click="showNotifDropdown = !showNotifDropdown"
              class="relative p-2 rounded-lg hover:bg-surface-container-low transition-colors"
            >
              <span class="material-symbols-outlined text-on-surface-variant">notifications</span>
              <span v-if="hasUnread" class="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
            </button>

            <!-- Dropdown -->
            <div v-if="showNotifDropdown" class="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant z-[60] overflow-hidden">
              <div class="p-4 border-b border-outline-variant flex items-center justify-between">
                <span class="font-bold text-sm text-on-surface">{{ $t('topbar.notifications') }}</span>
                <button @click="markAllAsRead" class="text-[10px] uppercase font-bold text-primary hover:underline">{{ $t('topbar.markAllRead') }}</button>
              </div>
              <div class="max-h-96 overflow-y-auto">
                <div v-if="notifications.length === 0" class="p-8 text-center text-on-surface-variant/50 text-sm">
                  No notifications
                </div>
                <div 
                  v-for="notif in notifications" 
                  :key="notif.id"
                  class="p-4 border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors cursor-pointer"
                  :class="{ 'bg-primary/5': !notif.read }"
                  @click="markAsRead(notif.id)"
                >
                  <p class="font-bold text-xs mb-1 text-on-surface">{{ notif.title }}</p>
                  <p class="text-xs text-on-surface-variant line-clamp-2">{{ notif.message }}</p>
                  <p class="text-[9px] text-on-surface-variant/40 mt-2">{{ new Date(notif.createdAt).toLocaleTimeString() }}</p>
                </div>
              </div>
              <!-- View All Link -->
              <div class="p-3 border-t border-outline-variant/20 text-center bg-surface-container-low/50">
                <NuxtLink
                  to="/admin/notifications"
                  @click="showNotifDropdown = false"
                  class="text-[11px] uppercase font-bold text-primary hover:underline tracking-wider"
                >
                  {{ $t('topbar.viewAll') }}
                </NuxtLink>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 pl-4 ms-4 border-l border-outline-variant/20 rtl:border-l-0 rtl:border-r rtl:pr-4 rtl:ms-4">
            <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-sm">person</span>
            </div>
            <div class="hidden md:block">
              <p class="text-sm font-medium text-on-surface uppercase">{{ user?.name || 'Admin User' }}</p>
              <p class="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">{{ user?.role || 'Guest' }}</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-8 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'

const { user, logout } = useAuth()
const route = useRoute()
const { hasPermission } = usePermissions()
const { searchQuery } = useSearch()
const { isDark, toggleTheme, initTheme } = useTheme()
const { notifications, hasUnread, markAsRead, markAllAsRead } = useNotifications()
const { settings } = useSettings()
const { locale, setLocale, t } = useI18n()

const showNotifDropdown = ref(false)

onMounted(() => {
  initTheme()
  // Set initial direction
  const lang = locale.value
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = lang
})

// Update direction when locale changes
watch(locale, (lang) => {
  if (process.client) {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }
})

const toggleLocale = () => {
  setLocale(locale.value === 'en' ? 'ar' : 'en')
}

// All menu items with their required permissions
const allMenuItems = [
  { name: 'sidebar.dashboard', path: '/admin/dashboard', icon: 'dashboard', permission: 'VIEW_PRODUCTS' },
  { name: 'sidebar.inventory', path: '/admin', icon: 'inventory_2', permission: 'VIEW_PRODUCTS' },
  { name: 'sidebar.categories', path: '/admin/categories', icon: 'folder', permission: 'VIEW_CATEGORIES' },
  { name: 'sidebar.orders', path: '/admin/orders', icon: 'shopping_bag', permission: 'VIEW_ORDERS' },
  { name: 'sidebar.users', path: '/admin/users', icon: 'people', permission: 'VIEW_USERS' },
  { name: 'sidebar.settings', path: '/admin/settings', icon: 'settings', permission: 'MANAGE_SETTINGS' }
]

// Filter menu items based on user permissions
const menuItems = computed(() => {
  if (!user.value) return []

  // SUPER_ADMIN sees everything
  if (user.value.role === 'SUPER_ADMIN') return allMenuItems

  // Filter items based on permissions
  const filtered = allMenuItems.filter(item => {
    const hasAccess = hasPermission(item.permission)
    return hasAccess
  })

  return filtered
})

const isActive = (path) => {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}

// Note: Route protection is now handled by middleware/permissions.global.ts
// This prevents UI flickering by checking permissions before the route loads
</script>