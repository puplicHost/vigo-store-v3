<template>
  <nav class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(28,27,27,0.04)]">
    <div class="flex justify-between items-center px-12 py-6 w-full max-w-screen-2xl mx-auto">
      <NuxtLink to="/" class="text-2xl font-serif italic text-stone-900 tracking-tight">VIGO</NuxtLink>
      
      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-10">
        <NuxtLink 
          to="/" 
          exact-active-class="text-primary border-b border-primary/30 pb-1" 
          class="text-stone-600 hover:text-stone-900 transition-colors font-serif tracking-tight"
        >
          {{ $t('nav.home') || 'Home' }}
        </NuxtLink>
        <NuxtLink 
          to="/products" 
          active-class="text-primary border-b border-primary/30 pb-1" 
          class="text-stone-600 hover:text-stone-900 transition-colors font-serif tracking-tight"
        >
          {{ $t('nav.shopAll') || 'Shop All' }}
        </NuxtLink>
        <NuxtLink 
          to="/about" 
          active-class="text-primary border-b border-primary/30 pb-1" 
          class="text-stone-600 hover:text-stone-900 transition-colors font-serif tracking-tight"
        >
          {{ $t('nav.aboutUs') || 'About Us' }}
        </NuxtLink>
      </div>

      <!-- User Actions -->
      <div class="flex items-center gap-6">
        <NuxtLink :to="isAuthenticated ? '/account' : '/auth/login'" class="hover:opacity-80 transition-all duration-300 text-primary">
          <span class="material-symbols-outlined">person</span>
        </NuxtLink>
        
        <NuxtLink 
          v-if="isAuthenticated && ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user?.role)" 
          to="/admin" 
          title="Dashboard" 
          class="hover:opacity-80 transition-all duration-300 text-primary"
        >
          <span class="material-symbols-outlined">dashboard</span>
        </NuxtLink>
        
        <NuxtLink to="/cart" class="hover:opacity-80 transition-all duration-300 text-primary relative">
          <span class="material-symbols-outlined">shopping_bag</span>
          <span 
            v-if="cartItemCount > 0" 
            class="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse"
          >
            {{ cartItemCount }}
          </span>
        </NuxtLink>
        
        <!-- Mobile Menu Toggle -->
        <button 
          @click="isMobileMenuOpen = true"
          class="md:hidden hover:opacity-80 transition-all duration-300 text-primary"
        >
          <span class="material-symbols-outlined">menu</span>
        </button>
      </div>
    </div>

    <!-- Mobile Sidebar -->
    <Transition name="slide">
      <div v-if="isMobileMenuOpen" class="fixed inset-0 z-[100] md:hidden">
        <div class="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" @click="isMobileMenuOpen = false"></div>
        <aside class="absolute top-0 right-0 w-[80%] h-full bg-white shadow-2xl p-10 flex flex-col">
          <div class="flex justify-between items-center mb-16">
            <span class="text-xl font-serif italic">VIGO</span>
            <button @click="isMobileMenuOpen = false" class="text-stone-400 hover:text-stone-900 transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <nav class="flex flex-col gap-8">
            <NuxtLink @click="isMobileMenuOpen = false" to="/" class="text-2xl font-serif italic text-stone-800 border-b border-stone-50 pb-4">Home</NuxtLink>
            <NuxtLink @click="isMobileMenuOpen = false" to="/products" class="text-2xl font-serif italic text-stone-800 border-b border-stone-50 pb-4">Shop All</NuxtLink>
            <NuxtLink @click="isMobileMenuOpen = false" to="/about" class="text-2xl font-serif italic text-stone-800 border-b border-stone-50 pb-4">Our Story</NuxtLink>
            <NuxtLink @click="isMobileMenuOpen = false" v-if="isAuthenticated && ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user?.role)" to="/admin" class="text-2xl font-serif italic text-primary border-b border-stone-50 pb-4">Admin Hub</NuxtLink>
          </nav>

          <div class="mt-auto pt-10 border-t border-stone-100 italic text-xs text-stone-400 font-serif">
            The Atelier Editorial - 2024
          </div>
        </aside>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
const { isAuthenticated, user } = useAuth()
const { cartItemCount } = useCart()
const isMobileMenuOpen = ref(false)
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
