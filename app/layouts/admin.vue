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
              type="text"
              placeholder="Search inventory..."
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

const menuItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
  { name: 'Inventory', path: '/admin', icon: 'inventory_2' },
  { name: 'Categories', path: '/categories', icon: 'folder' },
  { name: 'Orders', path: '/admin/orders', icon: 'shopping_bag' },
  { name: 'Users', path: '/admin/users', icon: 'people' },
  { name: 'Settings', path: '/admin/settings', icon: 'settings' }
]

const isActive = (path) => {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}

// Protect admin routes - only run on client side
onMounted(async () => {
  const auth = useAuth()

  // Wait a tick for auth state to hydrate
  await nextTick()

  // If no token at all, redirect immediately
  if (!auth.token.value) {
    navigateTo('/auth/login')
    return
  }

  // Try to fetch user if not loaded
  if (!auth.user.value) {
    try {
      await auth.fetchUser()
    } catch (err) {
      auth.logout()
      navigateTo('/auth/login')
      return
    }
  }

  // Check authentication and role
  const isAuthenticated = auth.isAuthenticated.value
  const isAdmin = auth.user.value?.role === 'ADMIN' || auth.user.value?.role === 'SUPER_ADMIN' || auth.user.value?.role === 'SALES' || auth.user.value?.role === 'MANAGER'

  if (!isAuthenticated || !isAdmin) {
    auth.logout()
    navigateTo('/auth/login')
    return
  }
})
</script>