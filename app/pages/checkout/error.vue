<template>
  <div class="min-h-screen bg-white flex items-center justify-center px-6 selection:bg-primary/20">
    <div class="max-w-xl w-full text-center space-y-12 animate-stagger">
      <div class="relative inline-block group">
        <div class="w-32 h-32 bg-stone-50 border border-stone-100 rounded-full flex items-center justify-center scale-110 shadow-2xl shadow-stone-900/5 transition-all duration-[2s] group-hover:scale-125">
          <span class="material-symbols-outlined text-stone-300 text-6xl italic">error_meditate</span>
        </div>
        <div class="absolute -inset-4 bg-stone-900/5 rounded-full animate-pulse opacity-20"></div>
      </div>
      
      <div class="space-y-8">
        <span class="text-[10px] uppercase tracking-[0.6em] text-red-400 font-bold italic">Transaction Interrupted</span>
        <h1 class="text-5xl md:text-7xl font-serif text-stone-900 italic font-bold tracking-tight leading-none">Aesthetic <br/>Commitment Delayed</h1>
        <p class="text-stone-400 font-body text-lg italic max-w-sm mx-auto leading-relaxed">
          {{ reason === 'payment_failed' ? "Our fiscal pipeline encountered an anomaly with your credentials. Please review your archive and attempt again." : "A logistical dissonance occurred while logging your narrative into our archives." }}
        </p>
      </div>

      <div class="pt-12 flex flex-col md:flex-row items-center justify-center gap-6">
        <NuxtLink to="/checkout" class="px-14 py-6 bg-stone-900 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-primary transition-all shadow-2xl shadow-stone-900/10 italic">
          Try Again
        </NuxtLink>
        <NuxtLink to="/cart" class="px-14 py-6 border border-stone-100 text-stone-400 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] hover:text-stone-900 hover:border-stone-900 transition-all italic">
          Return to Bag
        </NuxtLink>
      </div>

      <div class="pt-10 border-t border-stone-50 flex flex-col items-center gap-4">
         <p class="text-[9px] text-stone-300 font-bold uppercase tracking-[0.4em] italic">Persistent anomalies? Connect with our concierge.</p>
         <p class="text-[10px] text-stone-900 font-serif italic font-bold tracking-widest">{{ settings?.contactEmail }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const reason = computed(() => route.query.reason as string)
const { settings } = useSettings()

useHead({
  title: `Acquisition Halted | ${settings.value?.siteName || 'Vigo'}`
})
</script>
