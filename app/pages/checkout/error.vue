<template>
  <div class="min-h-screen bg-surface flex items-center justify-center px-6">
    <div class="max-w-md w-full text-center space-y-8 bg-surface-container-low p-12 rounded-[2.5rem] border border-outline-variant/10 shadow-2xl shadow-error/5">
      <div class="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mx-auto">
        <span class="material-symbols-outlined text-error text-5xl">error</span>
      </div>
      
      <div class="space-y-4">
        <h1 class="text-3xl font-serif text-on-surface italic">Payment Failed</h1>
        <p class="text-on-surface-variant font-body">
          {{ reason === 'payment_failed' ? "We couldn't process your payment. Please check your card details and try again." : "Something went wrong while processing your order." }}
        </p>
      </div>

      <div class="pt-8 space-y-4">
        <NuxtLink to="/checkout" class="block w-full py-4 bg-stone-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all shadow-lg">
          Try Again
        </NuxtLink>
        <NuxtLink to="/cart" class="block w-full py-4 border border-outline-variant/20 text-on-surface rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-surface-container-high transition-all">
          Back to Cart
        </NuxtLink>
      </div>

      <div class="pt-4">
        <p class="text-[10px] text-secondary/50 font-body">If the problem persists, please contact our support at {{ settings?.contactEmail }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const reason = computed(() => route.query.reason as string)
const { settings } = useSettings()

useHead({
  title: 'Payment Failed | Vigo Store'
})
</script>
