<template>
  <div class="min-h-screen bg-surface text-on-surface flex flex-col">
    <main class="pt-32 pb-24 px-6 md:px-12 max-w-screen-xl mx-auto flex-1 w-full">
      <h1 class="text-4xl md:text-5xl font-serif tracking-tight text-on-surface mb-12">Your Shopping Bag</h1>

      <div v-if="cartItems.length === 0" class="text-center py-24 bg-surface-container-low rounded-2xl border border-outline-variant/10">
        <div class="relative inline-block mb-12">
            <span class="material-symbols-outlined text-8xl text-stone-200">shopping_bag</span>
            <span class="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-ping"></span>
        </div>
        <h2 class="text-3xl font-serif mb-4 italic">The bag is currently vacant.</h2>
        <p class="text-stone-400 font-body mb-10 max-w-sm mx-auto">Discover our curated selection of archetypal silhouettes and modern essentials.</p>
        <NuxtLink to="/products" class="inline-flex items-center gap-3 px-10 py-4 bg-stone-900 text-stone-100 rounded font-label uppercase tracking-widest text-[11px] font-bold hover:bg-primary transition-all duration-500 shadow-xl shadow-stone-950/10 active:scale-95">
          Begin Exploring
          <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <!-- Cart Items List -->
        <div class="lg:col-span-8 flex flex-col">
          <div class="flex justify-between items-center pb-6 border-b border-stone-100 mb-8">
            <h3 class="text-xs uppercase tracking-[0.3em] font-bold text-stone-400">Bag Inventory</h3>
            <button @click="clearCart" class="text-xs uppercase tracking-[0.2em] font-label text-error/60 hover:text-error transition-colors flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">delete_sweep</span>
              Empty Bag
            </button>
          </div>

          <div class="space-y-4">
            <div v-for="item in cartItems" :key="item.id" class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-8 border-b border-stone-50 group last:border-0 hover:bg-stone-50/50 transition-colors px-4 rounded-xl">
              <div class="md:col-span-7 flex gap-8">
                <div class="w-28 h-36 bg-white rounded overflow-hidden flex-shrink-0 relative shadow-sm border border-stone-100 p-1">
                  <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover"/>
                  <div v-else class="w-full h-full flex items-center justify-center bg-stone-50"><span class="material-symbols-outlined text-stone-200">image</span></div>
                </div>
                <div class="flex flex-col justify-center">
                  <NuxtLink :to="`/products/${item.productId}`" class="font-serif text-xl tracking-tight hover:text-primary transition-all mb-2 italic">{{ item.name }}</NuxtLink>
                  <div class="text-[10px] uppercase tracking-widest text-stone-400 font-label flex flex-wrap gap-x-4 gap-y-2 mb-4">
                    <span v-if="item.size" class="flex items-center gap-1.5 ring-1 ring-stone-100 px-2 py-1 rounded">Size: <strong class="text-stone-900">{{ item.size }}</strong></span>
                    <span v-if="item.color" class="flex items-center gap-1.5 ring-1 ring-stone-100 px-2 py-1 rounded">Color: <span class="w-2 h-2 rounded-full border border-stone-200" :style="{ backgroundColor: item.color }"></span></span>
                  </div>
                  <button @click="removeFromCart(item.id)" class="text-[10px] uppercase font-bold tracking-[0.2em] text-red-400 hover:text-red-600 transition-colors flex items-center gap-2 w-max opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="material-symbols-outlined text-xs">close</span> Remove Piece
                  </button>
                </div>
              </div>

              <div class="md:col-span-2 flex justify-between md:justify-center items-center">
                <div class="flex items-center border border-stone-200 rounded p-1 bg-white">
                  <button @click="updateQuantity(item.id, item.quantity - 1)" class="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-primary transition-colors hover:bg-stone-50 rounded"><span class="material-symbols-outlined text-sm">remove</span></button>
                  <span class="w-8 text-center font-body text-xs font-bold">{{ item.quantity }}</span>
                  <button @click="updateQuantity(item.id, item.quantity + 1)" class="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-primary transition-colors hover:bg-stone-50 rounded"><span class="material-symbols-outlined text-sm">add</span></button>
                </div>
              </div>

              <div class="md:col-span-3 flex justify-between md:justify-end items-center">
                <span class="md:hidden text-xs uppercase tracking-widest text-stone-400 font-label">Total</span>
                <span class="font-body font-bold text-stone-900">{{ settings?.currency || 'EGP' }} {{ (item.price * item.quantity).toFixed(0) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-4">
           <div class="bg-stone-900 text-stone-100 p-10 rounded-2xl sticky top-32 shadow-2xl shadow-stone-950/20">
            <h2 class="text-2xl font-serif mb-8 border-b border-white/5 pb-6 italic">Bag Total</h2>
            
            <div class="space-y-5 mb-10">
              <div class="flex justify-between items-center text-stone-400 text-xs uppercase tracking-widest font-label">
                <span>Subtotal ({{ cartItemCount }} Items)</span>
                <span class="text-stone-100">{{ settings?.currency || 'EGP' }} {{ cartTotal.toFixed(0) }}</span>
              </div>
              <div class="flex justify-between items-center text-stone-400 text-xs uppercase tracking-widest font-label">
                <span>Shipping Fees</span>
                <span v-if="isShippingFree" class="text-primary font-bold">Complimentary</span>
                <span v-else class="text-stone-100">{{ settings?.currency || 'EGP' }} {{ settings?.shippingFee || 0 }}</span>
              </div>
              <div class="flex justify-between items-center text-stone-400 text-xs uppercase tracking-widest font-label">
                <span>Inclusive of VAT (14%)</span>
                <span class="text-stone-100">{{ settings?.currency || 'EGP' }} {{ (cartTotal * 0.14).toFixed(0) }}</span>
              </div>
            </div>

            <div class="flex justify-between items-center text-2xl font-serif mb-10 pt-8 border-t border-white/5 italic">
              <span>Grand Total</span>
              <span>{{ settings?.currency || 'EGP' }} {{ grandTotal.toFixed(0) }}</span>
            </div>

            <NuxtLink to="/checkout" class="block w-full py-6 text-center bg-white text-stone-950 rounded font-label uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-primary hover:text-white transition-all transform active:scale-[0.98] shadow-xl shadow-stone-950/40">
              Finalize Order
            </NuxtLink>
            
            <div class="mt-8 flex flex-col items-center gap-4">
               <div class="flex gap-4 opacity-30">
                 <span class="material-symbols-outlined text-xl">shield_locked</span>
                 <span class="material-symbols-outlined text-xl">credit_card</span>
                 <span class="material-symbols-outlined text-xl">account_balance</span>
               </div>
               <p class="text-[9px] uppercase tracking-[0.2em] text-stone-500 font-label">Secure Checkout Powered by Vigo</p>
            </div>
          </div>

          <!-- Free Shipping Upsell -->
          <div v-if="!isShippingFree && settings?.freeShippingThreshold > 0" class="mt-6 p-6 bg-primary/5 border border-primary/20 rounded-xl">
             <div class="flex items-center gap-3 mb-3">
               <span class="material-symbols-outlined text-primary text-sm animate-pulse">local_shipping</span>
               <span class="text-[10px] uppercase font-bold tracking-widest text-primary">Unlock Free Shipping</span>
             </div>
             <p class="text-xs text-stone-600 font-body mb-4 leading-relaxed">
               Add <strong>{{ settings?.currency || 'EGP' }} {{ (settings.freeShippingThreshold - cartTotal).toFixed(0) }}</strong> more to your bag and enjoy complimentary express delivery.
             </p>
             <div class="h-1 bg-stone-100 rounded-full overflow-hidden">
                <div class="h-full bg-primary transition-all duration-1000" :style="{ width: `${(cartTotal / settings.freeShippingThreshold) * 100}%` }"></div>
             </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer Space Filler if needed -->
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
  return cartTotal.value >= settings.value.freeShippingThreshold
})

const grandTotal = computed(() => {
  const shipping = isShippingFree.value ? 0 : (settings.value?.shippingFee || 0)
  return cartTotal.value + shipping
})

useHead({
  title: `Shopping Bag | ${settings.value?.siteName || 'VIGO'}`,
  meta: [
    { name: 'description', content: 'Review your selected items and proceed to checkout.' }
  ]
})
</script>
