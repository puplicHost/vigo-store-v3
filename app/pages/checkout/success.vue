<template>
  <div class="min-h-screen bg-white flex items-center justify-center px-6 selection:bg-primary/20">
    <div class="max-w-xl w-full text-center space-y-12 animate-stagger">
      <div class="relative inline-block group">
        <div class="w-32 h-32 bg-stone-50 border border-stone-100 rounded-full flex items-center justify-center scale-110 shadow-2xl shadow-primary/5 transition-all duration-[2s] group-hover:scale-125">
          <span class="material-symbols-outlined text-primary text-6xl italic">verified</span>
        </div>
        <div class="absolute -inset-4 bg-primary/10 rounded-full animate-ping opacity-20"></div>
      </div>
      
      <div class="space-y-8">
        <span class="text-[10px] uppercase tracking-[0.6em] text-primary font-bold italic">Acquisition Confirmed</span>
        <h1 class="text-5xl md:text-7xl font-serif text-stone-900 italic font-bold tracking-tight leading-none">Order Narrative <br/>Successfully Logged</h1>
        <p class="text-stone-400 font-body text-lg italic max-w-sm mx-auto leading-relaxed">Thank you for your commitment to our atelier. Your selection has been archived and is now entering our logistics pipeline.</p>
        
        <div v-if="orderId" class="inline-block px-8 py-3 bg-stone-50 rounded-full text-[10px] font-bold tracking-[0.4em] uppercase text-stone-400 border border-stone-100">
          Ref: {{ orderId.slice(-8).toUpperCase() }}
        </div>
      </div>

      <div class="pt-12 flex flex-col md:flex-row items-center justify-center gap-6">
        <NuxtLink to="/account" class="px-14 py-6 bg-stone-900 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-primary transition-all shadow-2xl shadow-stone-900/10 italic">
          Track Narrative
        </NuxtLink>
        <NuxtLink to="/" class="px-14 py-6 border border-stone-100 text-stone-400 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] hover:text-stone-900 hover:border-stone-900 transition-all italic">
          Continue Exploration
        </NuxtLink>
      </div>

      <div class="pt-10 border-t border-stone-50 flex flex-col items-center gap-4">
         <p class="text-[9px] text-stone-300 font-bold uppercase tracking-[0.4em] italic">A digital archive has been dispatched to your inbox.</p>
         <span class="text-[10px] text-stone-900 font-serif italic font-bold tracking-widest">{{ settings?.siteName || 'VIGO' }} ATELIER</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { settings } = useSettings()
const route = useRoute()
const orderId = computed(() => route.query.orderId as string)

useHead({
  title: `Acquisition Confirmed | ${settings.value?.siteName || 'Vigo'}`
})
</script>
