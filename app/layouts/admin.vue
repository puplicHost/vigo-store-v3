<template>
  <div class="min-h-screen bg-surface flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-outline-variant/20 flex flex-col">
      <!-- Logo -->
      <div class="p-8 border-b border-outline-variant/10">
        <h1 class="font-serif italic text-2xl tracking-[0.15em] text-on-surface">
          THE ATELIER
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
          <span class="font-label text-[11px] uppercase tracking-[0.15em]">{{ item.name }}</span>
        </NuxtLink>
      </nav>

      <!-- Bottom Actions -->
      <div class="p-6 border-t border-outline-variant/10">
        <button
          @click="logout"
          class="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-on-surface-variant hover:bg-error/10 hover:text-error transition-all duration-300"
        >
          <span class="material-symbols-outlined text-lg">logout</span>
          <span class="font-label text-[11px] uppercase tracking-[0.15em]">Sign Out</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Top Bar -->
      <header class="h-16 bg-white border-b border-outline-variant/20 flex items-center justify-between px-8">
        <!-- Search -->
        <div class="flex-1 max-w-md">
          <div class="relative group">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">
              search
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search..."
              class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg py-2.5 pl-10 pr-4 text-sm font-body focus:outline-none focus:border-primary/50 transition-all duration-300"
            />
          </div>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-4">
          <button class="relative p-2 rounded-lg hover:bg-surface-container-low transition-colors">
            <span class="material-symbols-outlined text-on-surface-variant">notifications</span>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
          </button>

          <div class="flex items-center gap-3 pl-4 border-l border-outline-variant/20">
            <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-sm">person</span>
            </div>
            <div class="hidden md:block">
              <p class="text-sm font-medium text-on-surface">{{ user?.name || 'Admin' }}</p>
              <p class="text-[10px] uppercase tracking-wider text-on-surface-variant">{{ user?.role || 'ADMIN' }}</p>
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

<script setup>
const { user, logout } = useAuth()
const route = useRoute()
const { hasPermission } = usePermissions()
const { searchQuery } = useSearch()

// All menu items with their required permissions
const allMenuItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard', permission: 'VIEW_PRODUCTS' },
  { name: 'Inventory', path: '/admin', icon: 'inventory_2', permission: 'VIEW_PRODUCTS' },
  { name: 'Categories', path: '/categories', icon: 'folder', permission: 'VIEW_CATEGORIES' },
  { name: 'Orders', path: '/admin/orders', icon: 'shopping_bag', permission: 'VIEW_ORDERS' },
  { name: 'Users', path: '/admin/users', icon: 'people', permission: 'VIEW_USERS' },
  { name: 'Settings', path: '/admin/settings', icon: 'settings', permission: 'MANAGE_SETTINGS' }
]

// Filter menu items based on user permissions
const menuItems = computed(() => {
  if (!user.value) return []

  // SUPER_ADMIN sees everything
  if (user.value.role === 'SUPER_ADMIN') return allMenuItems

  // Filter items based on permissions
  const filtered = allMenuItems.filter(item => {
    const hasAccess = hasPermission(item.permission)
    console.log(`[Sidebar] ${item.name} requires ${item.permission}, has access: ${hasAccess}, user role: ${user.value.role}`)
    return hasAccess
  })

  console.log('[Sidebar] Filtered menu items:', filtered.map(i => i.name))
  return filtered
})

const isActive = (path) => {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}

// Note: Route protection is now handled by middleware/permissions.global.ts
// This prevents UI flickering by checking permissions before the route loads
</script>