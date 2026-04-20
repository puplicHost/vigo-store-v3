<template>
  <div class="min-h-screen bg-surface flex transition-colors duration-300">
    <!-- Mobile Backdrop -->
    <div 
      v-if="isMobileSidebarOpen" 
      @click="closeMobileSidebar"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
    ></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed lg:sticky lg:top-0 lg:self-start lg:min-h-screen z-50 lg:z-auto flex flex-col',
        'w-[min(100%,288px)] lg:w-[272px]',
        'bg-surface-container-lowest',
        'backdrop-blur-xl border-r border-outline-variant/20',
        'shadow-[4px_0_32px_-8px_rgba(0,0,0,0.06)] dark:shadow-[4px_0_32px_-8px_rgba(0,0,0,0.45)]',
        'transition-transform duration-300 ease-out',
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Accent rail (solid) -->
      <div
        class="pointer-events-none absolute inset-y-0 start-0 w-px bg-outline-variant/25"
        aria-hidden="true"
      />

      <!-- Brand -->
      <div class="relative border-b border-outline-variant/10 px-6 pt-7 pb-5">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-[10px] font-semibold uppercase tracking-[0.35em] text-primary/90 mb-2">
              {{ $t('sidebar.badge') }}
            </p>
            <h1 class="font-serif italic text-xl sm:text-2xl leading-tight tracking-wide text-on-surface truncate">
              {{ settings?.siteName || 'THE ATELIER' }}
            </h1>
            <p class="mt-2 text-[11px] text-on-surface-variant/80 font-body leading-relaxed">
              {{ $t('sidebar.subtitle') }}
            </p>
          </div>
          <button
            type="button"
            @click="closeMobileSidebar"
            class="lg:hidden shrink-0 p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
            aria-label="Close menu"
          >
            <span class="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-5 space-y-1 overflow-y-auto scrollbar-custom">
        <p class="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">
          {{ $t('sidebar.sectionMenu') }}
        </p>
        <NuxtLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          @click="closeMobileSidebar"
          :class="[
            'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest',
            isActive(item.path)
              ? 'bg-primary/[0.12] dark:bg-primary/15 text-primary ring-1 ring-inset ring-primary/25'
              : 'text-on-surface-variant hover:bg-surface-container-low/90 hover:text-on-surface'
          ]"
        >
          <span
            v-if="isActive(item.path)"
            class="absolute start-0 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-full bg-primary"
            aria-hidden="true"
          />
          <span
            :class="[
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200',
              isActive(item.path)
                ? 'bg-primary/20 text-primary'
                : 'bg-surface-container-low text-on-surface-variant group-hover:bg-surface-container-high group-hover:text-on-surface'
            ]"
          >
            <span class="material-symbols-outlined text-[22px]">{{ item.icon }}</span>
          </span>
          <span
            :class="[
              'font-label text-[11px] uppercase tracking-[0.14em] leading-snug',
              isActive(item.path) ? 'font-semibold' : ''
            ]"
          >{{ $t(item.name) }}</span>
        </NuxtLink>
      </nav>

      <!-- Sign out -->
      <div class="p-4 mt-auto border-t border-outline-variant/10 bg-surface-container-low/30 dark:bg-black/15">
        <button
          type="button"
          class="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-on-surface-variant transition-colors duration-200 hover:bg-error/[0.08] hover:text-error"
          @click="logout"
        >
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-container-low text-error/80 transition-colors group-hover:bg-error/10">
            <span class="material-symbols-outlined text-[22px]">logout</span>
          </span>
          <span class="font-label text-[11px] uppercase tracking-[0.14em] text-start">{{ $t('sidebar.signOut') }}</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col lg:ml-0">
      <!-- Top Bar -->
      <header class="h-16 glass-surface border-b border-outline-variant/30 flex items-center justify-between px-4 lg:px-8 transition-colors duration-300 sticky top-0 z-40 shadow-[0_4px_24px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
        <!-- Left: Hamburger + Search -->
        <div class="flex items-center gap-4 flex-1">
          <!-- Hamburger Menu (Mobile only) -->
          <button 
            @click="openMobileSidebar"
            class="lg:hidden p-2 rounded-lg hover:bg-surface-container-low transition-colors"
          >
            <span class="material-symbols-outlined text-on-surface-variant text-xl">menu</span>
          </button>

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
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-4">
          <!-- View Store Button -->
          <NuxtLink 
            to="/" 
            target="_blank"
            class="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-[10px] font-bold uppercase tracking-widest"
          >
            <span class="material-symbols-outlined text-lg">storefront</span>
            {{ $t('topbar.viewStore') }}
          </NuxtLink>

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
              <span v-if="hasUnread" class="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-surface-container-lowest"></span>
            </button>

            <!-- Dropdown -->
            <div v-if="showNotifDropdown" class="absolute right-0 mt-2 w-80 bg-white/90 dark:bg-surface-container-lowest/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-outline-variant/20 z-[60] overflow-hidden transform transition-all">
              <div class="p-4 bg-surface-container-lowest/50 border-b border-outline-variant/10 flex items-center justify-between">
                <span class="font-bold text-sm text-on-surface">{{ $t('topbar.notifications') }}</span>
                <button @click="markAllAsRead" class="text-[10px] uppercase font-bold text-primary hover:text-primary/80 transition-colors">{{ $t('topbar.markAllRead') }}</button>
              </div>
              <div class="max-h-96 overflow-y-auto scrollbar-custom">
                <div v-if="notifications.length === 0" class="p-10 flex flex-col items-center text-center text-on-surface-variant/50">
                  <span class="material-symbols-outlined text-4xl mb-3 opacity-50">notifications_off</span>
                  <span class="text-sm font-medium">No notifications</span>
                </div>
                <div 
                  v-for="notif in notifications" 
                  :key="notif.id"
                  class="group p-4 border-b border-outline-variant/5 hover:bg-surface-container-low/50 transition-all duration-300 cursor-pointer relative"
                  :class="{ 'bg-primary/[0.03] dark:bg-primary/[0.08]': !notif.read }"
                  @click="markAsRead(notif.id)"
                >
                  <div v-if="!notif.read" class="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full shadow-[0_0_8px_rgba(var(--color-primary),0.5)]"></div>
                  <div class="flex items-start gap-3">
                    <div class="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" :class="notif.read ? 'bg-outline-variant/30' : 'bg-primary'"></div>
                    <div>
                      <p class="font-bold text-xs mb-1 text-on-surface group-hover:text-primary transition-colors">{{ notif.title }}</p>
                      <p class="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">{{ notif.message }}</p>
                      <p class="text-[10px] text-on-surface-variant/50 mt-2 font-medium">{{ new Date(notif.createdAt).toLocaleTimeString() }}</p>
                    </div>
                  </div>
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
const isMobileSidebarOpen = ref(false)

const openMobileSidebar = () => {
  isMobileSidebarOpen.value = true
}

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false
}

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