<template>
  <footer class="w-full pt-20 pb-10 bg-stone-100 font-body text-sm leading-relaxed tracking-wide">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 max-w-screen-2xl mx-auto">
      <div class="md:col-span-1">
        <span class="font-serif text-xl mb-4 block text-stone-900">{{ settings?.siteName || 'VIGO' }}</span>
        <p class="text-stone-500 mb-6 max-w-xs">{{ settings?.siteDescription || 'An exploration of aesthetic permanence and refined contemporary luxury.' }}</p>
      </div>
      <div class="flex flex-col gap-3">
        <span class="text-stone-900 font-semibold mb-2">Explore</span>
        <NuxtLink to="/" class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-opacity">Home</NuxtLink>
        <NuxtLink to="/products" class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-opacity">Shop All</NuxtLink>
        <NuxtLink to="/about" class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-opacity">About Us</NuxtLink>
      </div>
      <div class="flex flex-col gap-3">
        <span class="text-stone-900 font-semibold mb-2">Service</span>
        <a class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-opacity">Shipping & Returns</a>
        <a class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-opacity">Privacy Policy</a>
      </div>
      <div class="flex flex-col gap-3">
        <span class="text-stone-900 font-semibold mb-2">Contact</span>
        <a v-if="settings?.contactEmail" :href="`mailto:${settings.contactEmail}`" class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-opacity">
          {{ settings.contactEmail }}
        </a>
        <a v-if="settings?.contactPhone" :href="`tel:${settings.contactPhone}`" class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-opacity">
          {{ settings.contactPhone }}
        </a>
        <a v-if="settings?.whatsappNumber" :href="`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`" target="_blank" class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-opacity">
          {{ $t('footer.whatsapp') || 'WhatsApp' }}
        </a>
      </div>
    </div>
    <div class="mt-20 px-12 max-w-screen-2xl mx-auto border-t border-stone-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-stone-500 text-[10px] uppercase tracking-widest">© {{ new Date().getFullYear() }} {{ settings.siteName?.toUpperCase() || 'VIGO ATELIER' }}. ALL RIGHTS RESERVED.</p>
      <div class="flex gap-6">
        <a v-if="settings?.facebookUrl" :href="settings.facebookUrl" target="_blank" class="text-stone-500 hover:text-stone-900 transition-colors">
          <span class="material-symbols-outlined text-lg">public</span>
        </a>
        <a v-if="settings?.instagramUrl" :href="settings.instagramUrl" target="_blank" class="text-stone-500 hover:text-stone-900 transition-colors">
          <span class="material-symbols-outlined text-lg">share</span>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { settings } = useSettings()
</script>
