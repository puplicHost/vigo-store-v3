<template>
  <div class="min-h-screen bg-stone-50 text-stone-900 selection:bg-primary/20">
    <main class="pt-32 pb-24 px-8 md:px-16 max-w-screen-2xl mx-auto flex-1 w-full">
      
      <!-- Page Narrative -->
      <header class="mb-20">
        <nav class="mb-8 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold">
          <NuxtLink to="/products" class="hover:text-stone-900 transition-colors italic">Collections</NuxtLink>
          <span class="w-1 h-1 rounded-full bg-stone-200"></span>
          <span class="text-stone-900 italic font-medium">Your Selection Portfolio</span>
        </nav>
        <h1 class="text-6xl md:text-8xl font-serif font-bold tracking-tight text-stone-900 italic leading-none">Your Bag</h1>
      </header>

      <!-- Vacant State -->
      <div v-if="cartItems.length === 0" class="flex flex-col items-center justify-center py-40 text-center border-y border-stone-200">
        <div class="relative mb-12">
            <span class="material-symbols-outlined text-9xl text-stone-100 font-light italic">inventory_2</span>
            <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary/20 rounded-full animate-ping"></span>
        </div>
        <h2 class="text-4xl font-serif font-bold mb-6 italic tracking-tight">Your portfolio is currently vacant.</h2>
        <p class="text-stone-400 font-body text-lg mb-12 max-w-md mx-auto italic">
          Discover our curated editorial selection of artisanal heritage and contemporary silhouettes.
        </p>
        <NuxtLink to="/products" class="inline-flex items-center gap-6 px-14 py-6 bg-stone-900 text-white rounded-full font-label uppercase tracking-[0.4em] text-[11px] font-bold hover:bg-primary transition-all duration-700 shadow-2xl shadow-stone-900/10 hover:scale-105 active:scale-95">
          Begin Exploration
          <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-20 xl:gap-32">
        <!-- List of Pieces -->
        <div class="lg:col-span-8">
          <div class="flex justify-between items-end pb-10 border-b border-stone-200 mb-12">
            <div>
              <h3 class="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-400 mb-2">SELECTION INVENTORY</h3>
              <p class="text-2xl font-serif italic text-stone-900">{{ cartItemCount }} Items Curated</p>
            </div>
            <button @click="clearCart" class="text-[9px] uppercase tracking-[0.3em] font-bold text-stone-400 hover:text-red-500 transition-colors flex items-center gap-3 border-b border-stone-100 pb-1">
              Reset Collection
            </button>
          </div>

          <div class="space-y-12">
            <div v-for="item in cartItems" :key="item.id" class="flex flex-col md:flex-row gap-10 py-10 border-b border-stone-100 group last:border-0 hover:bg-white transition-all duration-700 px-6 rounded-3xl">
              <!-- Item Visual -->
              <div class="w-full md:w-44 aspect-[3/4] bg-white rounded-2xl overflow-hidden flex-shrink-0 relative border border-stone-100 shadow-sm p-4 group-hover:shadow-2xl transition-all duration-700">
                <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-contain transition-transform duration-[2s] group-hover:scale-110"/>
                <div v-else class="w-full h-full flex items-center justify-center bg-stone-50"><span class="material-symbols-outlined text-stone-100 text-4xl italic">image</span></div>
              </div>

              <!-- Item Narrative -->
              <div class="flex-1 flex flex-col justify-between py-2">
                <div class="flex justify-between items-start gap-6">
                  <div>
                    <h3 class="font-serif text-3xl font-bold tracking-tight text-stone-900 group-hover:text-primary transition-colors mb-4 italic">
                      {{ item.name }}
                    </h3>
                    <div class="flex flex-wrap gap-4 text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                      <span v-if="item.size" class="px-3 py-1.5 bg-stone-50 rounded-sm border border-stone-100">Proportion: <strong class="text-stone-900 italic font-serif">{{ item.size }}</strong></span>
                      <span v-if="item.color" class="px-3 py-1.5 bg-stone-50 rounded-sm border border-stone-100 flex items-center gap-2">
                        Tonal: <div class="w-2 h-2 rounded-full border border-stone-200" :style="{ backgroundColor: item.color }"></div>
                      </span>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-2xl font-body font-bold text-stone-900 tabular-nums tracking-tighter">
                      {{ settings?.currency || 'EGP' }} {{ (item.price * item.quantity).toFixed(0) }}
                    </p>
                    <p class="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-2">
                      Value: {{ settings?.currency || 'EGP' }} {{ item.price.toFixed(0) }} / EA
                    </p>
                  </div>
                </div>

                <div class="flex items-center justify-between mt-10">
                  <div class="flex items-center bg-white border border-stone-100 rounded-full h-12 px-2 shadow-sm">
                    <button @click="updateQuantity(item.id, item.quantity - 1)" class="w-9 h-9 rounded-full flex items-center justify-center text-stone-300 hover:text-stone-900 transition-colors"><span class="material-symbols-outlined text-sm">remove</span></button>
                    <span class="min-w-[32px] text-center font-body text-sm font-bold">{{ item.quantity }}</span>
                    <button @click="updateQuantity(item.id, item.quantity + 1)" class="w-9 h-9 rounded-full flex items-center justify-center text-stone-300 hover:text-stone-900 transition-colors"><span class="material-symbols-outlined text-sm">add</span></button>
                  </div>
                  
                  <button @click="removeFromCart(item.id)" class="text-[9px] uppercase font-bold tracking-[0.3em] text-stone-400 hover:text-red-500 transition-colors flex items-center gap-2 border-b border-transparent hover:border-red-100 pb-1">
                    Remove Piece
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Fiscal Summary -->
        <div class="lg:col-span-4">
           <div class="bg-stone-900 text-stone-100 p-12 rounded-[2.5rem] sticky top-40 shadow-3xl shadow-stone-900/40">
            <h2 class="text-3xl font-serif font-bold mb-10 border-b border-white/10 pb-10 italic">Summary</h2>
            
            <div class="space-y-6 mb-12">
              <div class="flex justify-between items-center text-[10px] uppercase font-bold tracking-[0.3em] text-stone-400">
                <span>Total Value</span>
                <span class="text-stone-100 tabular-nums">{{ settings?.currency || 'EGP' }} {{ cartTotal.toFixed(0) }}</span>
              </div>
              <div class="flex justify-between items-center text-[10px] uppercase font-bold tracking-[0.3em] text-stone-400">
                <span>Shipping Narrative</span>
                <span v-if="isShippingFree" class="text-primary italic font-serif">Complimentary</span>
                <span v-else class="text-stone-100 tabular-nums">{{ settings?.currency || 'EGP' }} {{ settings?.shippingFee || 0 }}</span>
              </div>
              <div class="flex justify-between items-center text-[10px] uppercase font-bold tracking-[0.3em] text-stone-400/50">
                <span>Incl. Value Taxes</span>
                <span class="text-stone-100/50 tabular-nums">{{ settings?.currency || 'EGP' }} {{ (cartTotal * 0.14).toFixed(0) }}</span>
              </div>
            </div>

            <div class="flex justify-between items-end text-4xl font-serif font-bold mb-14 pt-10 border-t border-white/10 italic">
              <span class="text-xs uppercase font-bold tracking-[0.3em] text-stone-500 not-italic mb-2">Grand Total</span>
              <span class="tracking-tighter">{{ settings?.currency || 'EGP' }} {{ grandTotal.toFixed(0) }}</span>
            </div>

            <NuxtLink to="/checkout" class="block w-full py-7 text-center bg-white text-stone-900 rounded-full font-label uppercase tracking-[0.4em] text-[11px] font-bold hover:bg-primary hover:text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-black/20">
              Commit to Order
            </NuxtLink>
            
            <div class="mt-10 pt-10 border-t border-white/5 flex flex-col items-center gap-6 text-center">
               <div class="flex gap-8 opacity-20">
                 <span class="material-symbols-outlined text-2xl font-light">verified_user</span>
                 <span class="material-symbols-outlined text-2xl font-light">lock</span>
                 <span class="material-symbols-outlined text-2xl font-light">payments</span>
               </div>
               <p class="text-[8px] uppercase tracking-[0.4em] text-stone-500 font-bold leading-relaxed">
                 Encrypted Fiscal Processing<br/>Curated by Vigo Atelier
               </p>
            </div>
          </div>

          <!-- Shipping Advancement -->
          <div v-if="!isShippingFree && settings?.freeShippingThreshold > 0" class="mt-8 p-8 bg-white border border-stone-100 rounded-3xl shadow-sm">
             <div class="flex items-center justify-between mb-6">
               <div class="flex items-center gap-3">
                 <span class="material-symbols-outlined text-primary text-lg italic">auto_awesome</span>
                 <span class="text-[9px] uppercase font-bold tracking-[0.3em] text-stone-900">Complimentary Shipping</span>
               </div>
               <span class="text-[10px] text-stone-400 tabular-nums">Remaining: {{ (settings.freeShippingThreshold - cartTotal).toFixed(0) }}</span>
             </div>
             <p class="text-xs text-stone-500 font-body italic mb-6 leading-relaxed">
               Elevate your selection by <strong>{{ (settings.freeShippingThreshold - cartTotal).toFixed(0) }}</strong> to unlock archived complimentary logistics.
             </p>
             <div class="h-1 bg-stone-50 rounded-full overflow-hidden">
                <div class="h-full bg-primary transition-all duration-[2s] cubic-bezier(0.2, 0.8, 0.2, 1)" :style="{ width: `${Math.min((cartTotal / settings.freeShippingThreshold) * 100, 100)}%` }"></div>
             </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { settings } = useSettings()
const { cartItems, cartTotal, cartItemCount, removeFromCart, updateQuantity, clearCart } = useCart()

definePageMeta({
  middleware: 'auth'
})

const isShippingFree = computed(() => {
  if (!settings.value?.freeShippingThreshold) return false
  return cartTotal.value >= (settings.value.freeShippingThreshold || 0)
})

const grandTotal = computed(() => {
  const shipping = isShippingFree.value ? 0 : (settings.value?.shippingFee || 0)
  return cartTotal.value + shipping
})

useHead({
  title: `Your Bag | ${settings.value?.siteName || 'VIGO ATELIER'}`,
  meta: [
    { name: 'description', content: 'Review your selected artisanal collection and proceed to fiscal commitment.' }
  ]
})
</script>

<style scoped>
/* Hidden scrollbar but keeps functionality */
[appearance="textfield"]::-webkit-outer-spin-button,
[appearance="textfield"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
