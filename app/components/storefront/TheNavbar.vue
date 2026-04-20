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
      
      <!-- Center: Desktop Navigation -->
      <div class="hidden md:flex items-center gap-12 flex-grow justify-center">
        <NuxtLink 
          to="/" 
          active-class="text-primary"
          class="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-400 hover:text-stone-900 transition-all duration-500"
        >
          {{ $t('nav.home') || 'Home' }}
        </NuxtLink>
        <NuxtLink 
          to="/products" 
          active-class="text-primary"
          class="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-400 hover:text-stone-900 transition-all duration-500"
        >
          {{ $t('nav.shopAll') || 'Collections' }}
        </NuxtLink>
        <NuxtLink 
          to="/about" 
          active-class="text-primary"
          class="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-400 hover:text-stone-900 transition-all duration-500"
        >
          {{ $t('nav.aboutUs') || 'Our Story' }}
        </NuxtLink>
      </div>

      <!-- Right: User Actions -->
      <div class="flex-1 flex justify-end items-center gap-8">
        <NuxtLink :to="isAuthenticated ? '/account' : '/auth/login'" class="text-stone-400 hover:text-primary transition-all duration-500">
           <span class="material-symbols-outlined font-light text-2xl italic">person</span>
        </NuxtLink>
        
        <NuxtLink 
          v-if="isAuthenticated && ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user?.role)" 
          to="/admin" 
          title="Dashboard" 
          class="text-stone-400 hover:text-primary transition-all duration-500"
        >
          <span class="material-symbols-outlined font-light text-2xl italic">dashboard_customize</span>
        </NuxtLink>
        
        <NuxtLink to="/cart" class="text-stone-900 hover:text-primary transition-all duration-500 relative group">
          <span class="material-symbols-outlined font-light text-2xl italic">shopping_bag</span>
          <span 
            v-if="cartItemCount > 0" 
            class="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
          >
            {{ cartItemCount }}
          </span>
        </NuxtLink>
        
        <!-- Mobile Menu Toggle -->
        <button 
          @click="isMobileMenuOpen = true"
          class="md:hidden text-stone-400 hover:text-stone-900 transition-all duration-500"
        >
          <span class="material-symbols-outlined font-light text-2xl">menu</span>
        </button>
      </div>
    </div>

    <!-- Mobile Sidebar Refined -->
    <Transition name="slide">
      <div v-if="isMobileMenuOpen" class="fixed inset-0 z-[100] md:hidden">
        <div class="absolute inset-0 bg-stone-900/10 backdrop-blur-sm" @click="isMobileMenuOpen = false"></div>
        <aside class="absolute top-0 right-0 w-[85%] h-full bg-white shadow-3xl p-12 flex flex-col animate-stagger">
          <div class="flex justify-between items-center mb-20">
            <span class="text-xs uppercase tracking-[0.5em] font-bold text-stone-300">Navigation</span>
            <button @click="isMobileMenuOpen = false" class="text-stone-300 hover:text-stone-900 transition-colors">
              <span class="material-symbols-outlined font-light">close</span>
            </button>
          </div>

          <nav class="flex flex-col gap-10">
            <NuxtLink @click="isMobileMenuOpen = false" to="/" class="text-4xl font-serif italic text-stone-900 hover:text-primary transition-colors flex items-center justify-between group">
              Home
              <span class="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </NuxtLink>
            <NuxtLink @click="isMobileMenuOpen = false" to="/products" class="text-4xl font-serif italic text-stone-900 hover:text-primary transition-colors flex items-center justify-between group">
              Collections
              <span class="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </NuxtLink>
            <NuxtLink @click="isMobileMenuOpen = false" to="/about" class="text-4xl font-serif italic text-stone-900 hover:text-primary transition-colors flex items-center justify-between group">
              Our Story
              <span class="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </NuxtLink>
          </nav>

          <div class="mt-auto pt-10 border-t border-stone-50 flex justify-between items-center">
            <span class="text-[9px] uppercase tracking-[0.3em] font-bold text-stone-300">© 2024 {{ settings?.siteName || 'VIGO' }}</span>
            <div class="flex gap-4">
               <span class="mdi mdi-instagram text-stone-300"></span>
               <span class="mdi mdi-pinterest text-stone-300"></span>
            </div>
          </div>
        </aside>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
const { isAuthenticated, user } = useAuth()
const { settings } = useSettings()
const { cartItemCount } = useCart()
const isMobileMenuOpen = ref(false)
const hasLogoError = ref(false)
</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
