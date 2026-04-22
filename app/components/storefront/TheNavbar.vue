<template>
  <nav class="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-stone-100">
    <div class="flex justify-between items-center px-6 md:px-12 py-5 w-full max-w-screen-2xl mx-auto">
      <!-- Left: Brand -->
      <div class="flex-1">
        <NuxtLink to="/" class="flex items-center gap-4 group">
          <template v-if="settings?.logo && !hasLogoError">
            <img 
              :src="settings.logo" 
              alt="Logo" 
              class="h-9 w-9 rounded-full aspect-square object-cover border border-stone-100 group-hover:border-primary/30 transition-all duration-700"
              @error="hasLogoError = true"
            />
          </template>
          <span class="text-xl font-serif tracking-[0.3em] text-stone-900 uppercase italic font-bold">
            {{ settings?.siteName || 'ELIXIR' }}
          </span>
        </NuxtLink>
      </div>
      
      <!-- Center: Normal Navigation (Desktop) -->
      <nav class="hidden md:flex flex-grow justify-center items-center gap-10">
        <NuxtLink
          to="/"
          active-class="text-primary"
          class="text-[11px] uppercase tracking-[0.3em] font-bold text-stone-500 hover:text-stone-900 transition-colors"
        >
          {{ $t('nav.home') || 'Home' }}
        </NuxtLink>
        <NuxtLink
          to="/products"
          active-class="text-primary"
          class="text-[11px] uppercase tracking-[0.3em] font-bold text-stone-500 hover:text-stone-900 transition-colors"
        >
          {{ $t('nav.shopAll') || 'Collections' }}
        </NuxtLink>
        <NuxtLink
          to="/about"
          active-class="text-primary"
          class="text-[11px] uppercase tracking-[0.3em] font-bold text-stone-500 hover:text-stone-900 transition-colors"
        >
          {{ $t('nav.aboutUs') || 'Our Story' }}
        </NuxtLink>
      </nav>

      <!-- Spacer for mobile (center area) -->
      <div class="flex md:hidden flex-grow"></div>

      <!-- Right: User Actions -->
      <div class="flex-1 flex justify-end items-center gap-8">
        <NuxtLink :to="isAuthenticated ? '/account' : '/auth/login'" class="text-stone-600 hover:text-primary transition-all duration-500 mobile-touch-target">
           <span class="material-symbols-outlined font-light text-2xl italic">person</span>
        </NuxtLink>
        
        <NuxtLink 
          v-if="isAuthenticated && ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user?.role)" 
          to="/admin" 
          title="Dashboard" 
          class="text-stone-600 hover:text-primary transition-all duration-500 mobile-touch-target"
        >
          <span class="material-symbols-outlined font-light text-2xl italic">dashboard_customize</span>
        </NuxtLink>
        
        <button
          @click="isCartDrawerOpen = true"
          class="text-stone-900 hover:text-primary transition-all duration-500 relative group mobile-touch-target"
          aria-label="Open cart"
        >
          <span class="material-symbols-outlined font-light text-2xl italic">shopping_bag</span>
          <span
            v-if="cartItemCount > 0"
            class="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
          >
            {{ cartItemCount }}
          </span>
        </button>
        
        <!-- Mobile Menu Toggle (Burger Icon) -->
        <button
          @click="isDropdownOpen = !isDropdownOpen"
          :aria-expanded="isDropdownOpen"
          aria-label="Toggle menu"
          class="md:hidden text-stone-600 hover:text-stone-900 transition-all duration-500 relative mobile-touch-target"
        >
          <span class="material-symbols-outlined font-light text-2xl">menu</span>
          
          <!-- Dropdown Menu (Mobile Only) -->
          <Transition name="fade">
            <div
              v-if="isDropdownOpen"
              class="absolute top-full right-0 mt-4 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-stone-100 py-4 min-w-[200px] z-50"
              @click.stop
            >
              <NuxtLink
                to="/"
                @click="isDropdownOpen = false"
                active-class="text-primary bg-stone-50"
                class="block px-6 py-3 text-sm text-stone-900 hover:bg-stone-50 hover:text-primary transition-colors font-body"
              >
                {{ $t('nav.home') || 'Home' }}
              </NuxtLink>
              <NuxtLink
                to="/products"
                @click="isDropdownOpen = false"
                active-class="text-primary bg-stone-50"
                class="block px-6 py-3 text-sm text-stone-900 hover:bg-stone-50 hover:text-primary transition-colors font-body"
              >
                {{ $t('nav.shopAll') || 'Collections' }}
              </NuxtLink>
              <NuxtLink
                to="/about"
                @click="isDropdownOpen = false"
                active-class="text-primary bg-stone-50"
                class="block px-6 py-3 text-sm text-stone-900 hover:bg-stone-50 hover:text-primary transition-colors font-body"
              >
                {{ $t('nav.aboutUs') || 'Our Story' }}
              </NuxtLink>
            </div>
          </Transition>
        </button>
      </div>
    </div>

    <CartDrawer v-model:open="isCartDrawerOpen" />
  </nav>
</template>

<script setup lang="ts">
const { isAuthenticated, user } = useAuth()
const { settings } = useSettings()
const { cartItemCount } = useCart()
const isDropdownOpen = ref(false)
const isCartDrawerOpen = ref(false)
const hasLogoError = ref(false)

// Close dropdown when clicking outside
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    // Check if click is on the burger button or inside the dropdown
    const burgerButton = document.querySelector('button.md\\:hidden')
    if (burgerButton && !burgerButton.contains(target)) {
      isDropdownOpen.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.2s ease-in-out;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
