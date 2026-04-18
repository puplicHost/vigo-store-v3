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
        
        <!-- Mobile Menu Toggle (to be implemented in 2.4) -->
        <button class="md:hidden hover:opacity-80 transition-all duration-300 text-primary">
          <span class="material-symbols-outlined">menu</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { isAuthenticated, user } = useAuth()
const { cartItemCount } = useCart()
</script>
