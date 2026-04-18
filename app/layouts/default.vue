<template>
  <div class="min-h-screen bg-surface text-on-surface font-body flex flex-col">
    <!-- Announcement Bar -->
    <div v-if="settings?.freeShippingThreshold > 0" class="w-full py-2.5 bg-stone-900 text-stone-100 flex items-center justify-center gap-6 overflow-hidden relative z-[60]">
      <div class="flex items-center gap-2 animate-marquee whitespace-nowrap">
        <span class="text-[10px] uppercase tracking-[0.3em] font-medium">Free shipping on orders above {{ settings.currency || 'EGP' }} {{ settings.freeShippingThreshold }}</span>
        <span class="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
        <span class="text-[10px] uppercase tracking-[0.3em] font-medium">Limited Edition Winter 2024 Now Available</span>
        <span class="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
        <span class="text-[10px] uppercase tracking-[0.3em] font-medium">Secure Payment via Credit Card or COD</span>
      </div>
      <!-- Marquee Shadow Effect -->
      <div class="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-stone-900 to-transparent pointer-events-none z-10"></div>
      <div class="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-stone-900 to-transparent pointer-events-none z-10"></div>
    </div>

    <StorefrontTheNavbar :class="{ 'top-10': settings?.freeShippingThreshold > 0 }" />
    <div class="flex-grow">
      <NuxtPage />
    </div>
    <StorefrontTheFooter />
  </div>
</template>

<script setup>
const { settings } = useSettings()
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap');

.font-body {
  font-family: 'Manrope', sans-serif;
}

@keyframes marquee {
  0% { transform: translateX(50%); }
  100% { transform: translateX(-100%); }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
}

/* Ensure navbar transition is smooth when announcement bar is present */
.fixed {
  transition: top 0.3s ease-in-out;
}
</style>
