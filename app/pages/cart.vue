<template>
  <div class="min-h-screen bg-surface text-on-surface flex flex-col">
    <main class="pt-32 pb-24 px-6 md:px-12 max-w-screen-xl mx-auto flex-1 w-full">
      <h1 class="text-4xl md:text-5xl font-serif tracking-tight text-on-surface mb-12">Your Shopping Bag</h1>

      <div v-if="cartItems.length === 0" class="text-center py-24 bg-surface-container-low rounded-2xl border border-outline-variant/20">
        <span class="material-symbols-outlined text-6xl text-outline-variant mb-6">shopping_bag</span>
        <h2 class="text-2xl font-serif mb-4">Your bag is empty</h2>
        <p class="text-secondary font-body mb-8">Discover our exquisite collection and find something exceptional.</p>
        <NuxtLink to="/products" class="inline-block px-8 py-4 bg-primary text-on-primary rounded font-label uppercase tracking-widest text-xs hover:bg-primary/90 transition-colors">Explore Collection</NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <!-- Cart Items List -->
        <div class="lg:col-span-8 space-y-8">
          <div class="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-outline-variant/30 text-xs uppercase tracking-widest text-secondary font-label">
            <div class="col-span-6">Product</div>
            <div class="col-span-3 text-center">Quantity</div>
            <div class="col-span-3 text-right">Total</div>
          </div>

          <div v-for="item in cartItems" :key="item.id" class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-6 border-b border-outline-variant/10 group">
            <div class="md:col-span-6 flex gap-6">
              <div class="w-24 h-32 bg-surface-container rounded-lg overflow-hidden flex-shrink-0 relative">
                <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover"/>
                <div v-else class="w-full h-full flex items-center justify-center"><span class="material-symbols-outlined text-outline-variant">image</span></div>
              </div>
              <div class="flex flex-col justify-center">
                <NuxtLink :to="`/products/${item.productId}`" class="font-serif text-lg hover:text-primary transition-colors mb-1">{{ item.name }}</NuxtLink>
                <div class="text-sm text-secondary font-body mb-3">
                  <span v-if="item.size" class="mr-3">Size: <strong class="text-on-surface">{{ item.size }}</strong></span>
                  <span v-if="item.color">Color: <strong class="text-on-surface">{{ item.color }}</strong></span>
                </div>
                <button @click="removeFromCart(item.id)" class="text-xs uppercase font-label tracking-widest text-secondary hover:text-error transition-colors flex items-center gap-1 w-max">
                  <span class="material-symbols-outlined text-[14px]">delete</span> Remove
                </button>
              </div>
            </div>

            <div class="md:col-span-3 flex justify-between md:justify-center items-center">
              <span class="md:hidden text-xs uppercase tracking-widest text-secondary font-label">Quantity</span>
              <div class="flex items-center border border-outline-variant/30 rounded-full px-2">
                <button @click="updateQuantity(item.id, item.quantity - 1)" class="w-8 h-8 flex items-center justify-center text-secondary hover:text-primary transition-colors"><span class="material-symbols-outlined text-[14px]">remove</span></button>
                <span class="w-8 text-center font-body text-sm font-semibold">{{ item.quantity }}</span>
                <button @click="updateQuantity(item.id, item.quantity + 1)" class="w-8 h-8 flex items-center justify-center text-secondary hover:text-primary transition-colors"><span class="material-symbols-outlined text-[14px]">add</span></button>
              </div>
            </div>

            <div class="md:col-span-3 flex justify-between md:justify-end items-center">
              <span class="md:hidden text-xs uppercase tracking-widest text-secondary font-label">Total</span>
              <span class="font-body font-semibold text-lg">{{ settings?.currency || 'EGP' }} {{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-4">
          <div class="bg-surface-container-low p-8 rounded-2xl sticky top-32">
            <h2 class="text-2xl font-serif mb-8 border-b border-outline-variant/20 pb-4">Order Summary</h2>
            
            <div class="space-y-4 mb-8">
              <div class="flex justify-between text-secondary text-sm font-body">
                <span>Subtotal ({{ cartItemCount }} items)</span>
                <span>{{ settings?.currency || 'EGP' }} {{ cartTotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-secondary text-sm font-body">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div class="flex justify-between text-xl font-bold font-serif mb-8 pt-6 border-t border-outline-variant/20">
              <span>Estimated Total</span>
              <span>{{ settings?.currency || 'EGP' }} {{ cartTotal.toFixed(2) }}</span>
            </div>

            <NuxtLink to="/checkout" class="block w-full py-5 text-center bg-gradient-to-tr from-primary to-primary-container text-on-primary rounded-xl font-label uppercase tracking-[0.2em] text-sm font-bold shadow-lg shadow-primary/10 hover:opacity-90 transition-all transform active:scale-[0.98]">
              Proceed to Checkout
            </NuxtLink>
            
            <div class="mt-6 flex justify-center gap-4 text-secondary/50 grayscale">
               <span class="material-symbols-outlined text-xl">lock</span>
               <span class="material-symbols-outlined text-xl">credit_card</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer Space Filler if needed -->
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated, user } = useAuth()
const { settings } = useSettings()
const { cartItems, cartTotal, cartItemCount, removeFromCart, updateQuantity } = useCart()

definePageMeta({
  middleware: 'auth'
})

useHead({
  title: `Shopping Bag | ${settings.value?.siteName || 'VIGO'}`
})
</script>
