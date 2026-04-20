<template>
  <footer class="w-full bg-stone-900 text-stone-100 font-body selection:bg-primary/20">
    <!-- Primary Info & Links -->
    <div class="max-w-screen-2xl mx-auto px-8 md:px-16 pt-32 pb-24 border-b border-white/5">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-20">
        
        <!-- Brand Narrative -->
        <div class="md:col-span-4 space-y-10">
          <div class="space-y-6">
            <NuxtLink to="/" class="text-3xl font-serif italic text-white tracking-[0.3em] uppercase block font-bold">
              {{ settings?.siteName || 'ELIXIR ATELIER' }}
            </NuxtLink>
            <p class="text-stone-500 font-body text-sm leading-relaxed max-w-sm italic">
              {{ settings?.siteDescription || 'Curating the new era of artisanal luxury through sustainable craft and timeless silhouettes.' }}
            </p>
          </div>

          <!-- Social Icons (Moved from bottom bar) -->
          <div v-if="hasSocialLinks" class="flex gap-8 items-center pt-4">
             <a v-if="settings?.instagramUrl" :href="settings.instagramUrl" target="_blank" class="text-stone-500 hover:text-primary transition-all hover:scale-110">
               <span class="mdi mdi-instagram text-xl"></span>
             </a>
             <a v-if="settings?.facebookUrl" :href="settings.facebookUrl" target="_blank" class="text-stone-500 hover:text-primary transition-all hover:scale-110">
               <span class="mdi mdi-facebook text-xl"></span>
             </a>
             <a v-if="settings?.tiktokUrl" :href="settings.tiktokUrl" target="_blank" class="text-stone-500 hover:text-primary transition-all hover:scale-110">
               <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                 <path d="M12.525.02c1.31-.032 2.617-.023 3.926-.03 0 1.353.012 2.706-.01 4.058.005.626.757 1.05 1.224 1.405 1.01.768 2.3 1.253 3.528 1.455.01 1.342.006 2.684.008 4.026-.7-.03-1.425-.132-2.1-.314a5.614 5.614 0 0 1-2.912-1.928 2.016 2.016 0 0 1-.36-.457V12.7c0 3.01-1.33 6.132-4.524 6.848-1.53.344-3.132.222-4.57-.42a6.766 6.766 0 0 1-3.694-5.26 7.15 7.15 0 0 1 1.63-6.282 6.64 6.64 0 0 1 3.447-2.316V2a7.35 7.35 0 0 0-.25 1.54 6.89 6.89 0 0 0 1.15 4.54l.011.01-.01.01a6.83 6.83 0 0 0 5.4 3.12l.006-8.2c-1.3-.012-2.6-.006-3.9-.012V.02Z"/>
               </svg>
             </a>
             <a v-if="settings?.snapchatUrl" :href="settings.snapchatUrl" target="_blank" class="text-stone-500 hover:text-primary transition-all hover:scale-110">
               <span class="mdi mdi-snapchat text-xl"></span>
             </a>
             <a v-if="settings?.whatsappNumber" :href="`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`" target="_blank" class="text-stone-500 hover:text-primary transition-all hover:scale-110">
               <span class="mdi mdi-whatsapp text-xl"></span>
             </a>
          </div>
        </div>

        <!-- Links Grid -->
        <div class="md:col-span-5 grid grid-cols-2 gap-12">
          <div class="space-y-10">
            <h3 class="text-sm font-serif italic text-white tracking-[0.1em] font-bold">Shop</h3>
            <nav class="flex flex-col gap-5">
              <NuxtLink v-for="link in quickLinks" :key="link.label" :to="link.to" class="text-xs uppercase tracking-[0.2em] font-bold text-stone-500 hover:text-white transition-all transform hover:translate-x-1">
                {{ link.label }}
              </NuxtLink>
            </nav>
          </div>
          <div class="space-y-10">
            <h3 class="text-sm font-serif italic text-white tracking-[0.1em] font-bold">Customer Care</h3>
            <nav class="flex flex-col gap-5">
              <a href="#" class="text-xs uppercase tracking-[0.2em] font-bold text-stone-500 hover:text-white transition-all transform hover:translate-x-1">Shipping & Returns</a>
              <a href="#" class="text-xs uppercase tracking-[0.2em] font-bold text-stone-500 hover:text-white transition-all transform hover:translate-x-1">Privacy Policy</a>
              <a href="#" class="text-xs uppercase tracking-[0.2em] font-bold text-stone-500 hover:text-white transition-all transform hover:translate-x-1">Contact Us</a>
            </nav>
          </div>
        </div>

        <!-- Newsletter Section -->
        <div class="md:col-span-3 space-y-10">
          <h3 class="text-sm font-serif italic text-white tracking-[0.1em] font-bold">Join the Atelier</h3>
          <p class="text-xs text-stone-500 font-medium leading-relaxed italic">Receive exclusive updates on our latest collections.</p>
          <div class="relative group">
            <input 
              type="email" 
              placeholder="Your Email Address" 
              class="w-full bg-transparent border-0 border-b border-white/20 py-4 px-0 focus:ring-0 focus:border-primary transition-all duration-700 font-body text-sm text-white placeholder:text-stone-700"
            />
            <button class="absolute right-0 bottom-4 text-white hover:text-primary transition-colors transform hover:translate-x-2">
              <span class="material-symbols-outlined font-light">arrow_forward</span>
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="max-w-screen-2xl mx-auto px-8 md:px-16 py-12 flex flex-col items-center gap-4 text-center">
      <p class="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-600">
        © 2026 {{ settings?.siteName || 'VIGO' }} . ALL RIGHTS RESERVED.
      </p>
      <a href="https://yaaalla.com/" target="_blank" class="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-600 hover:text-primary transition-colors">
        Designed by Yaaalla
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { settings } = useSettings()

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop All', to: '/products' },
  { label: 'About Us', to: '/about' },
  { label: 'Cart', to: '/cart' }
]

const hasSocialLinks = computed(() => {
  return !!(
    settings.value?.instagramUrl ||
    settings.value?.facebookUrl ||
    settings.value?.tiktokUrl ||
    settings.value?.snapchatUrl ||
    settings.value?.whatsappNumber
  )
})
</script>

<style scoped>
</style>
