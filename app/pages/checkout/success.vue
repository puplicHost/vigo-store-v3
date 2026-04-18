<template>
  <div class="min-h-screen bg-surface flex items-center justify-center px-6">
    <div class="max-w-md w-full text-center space-y-8 bg-surface-container-low p-12 rounded-[2.5rem] border border-outline-variant/10 shadow-2xl shadow-success/5">
      <div class="relative inline-block">
        <div class="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center scale-110">
          <span class="material-symbols-outlined text-success text-5xl">check_circle</span>
        </div>
        <div class="absolute -inset-2 bg-success/5 rounded-full animate-ping opacity-20"></div>
      </div>
      
      <div class="space-y-4">
        <h1 class="text-3xl font-serif text-on-surface italic">Order Confirmed</h1>
        <p class="text-on-surface-variant font-body">Thank you for your purchase. We've received your order and are processing it now.</p>
        <div v-if="orderId" class="inline-block px-4 py-1 bg-surface-container-high rounded-full text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
          Order #{{ orderId.slice(-8).toUpperCase() }}
        </div>
      </div>

      <div class="pt-8 space-y-4">
        <NuxtLink to="/account" class="block w-full py-4 bg-stone-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all shadow-lg">
          Track My Order
        </NuxtLink>
        <NuxtLink to="/" class="block w-full py-4 border border-outline-variant/20 text-on-surface rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-surface-container-high transition-all">
          Continue Shopping
        </NuxtLink>
      </div>

      <p class="text-[10px] text-secondary/50 font-body">A confirmation email has been sent to your inbox.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const orderId = computed(() => route.query.orderId as string)

useHead({
  title: 'Order Confirmed | Vigo Store'
})
</script>
