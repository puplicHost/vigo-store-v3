<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="isOpen" class="fixed inset-0 z-[100]">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="close"
        ></div>

        <!-- Drawer -->
        <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-stone-100">
            <h2 class="text-2xl font-serif font-bold italic text-stone-900">Your Bag</h2>
            <button
              @click="close"
              class="p-2 hover:bg-stone-50 rounded-full transition-colors mobile-touch-target"
              aria-label="Close cart"
            >
              <span class="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          <!-- Cart Items -->
          <div class="flex-1 overflow-y-auto p-6">
            <div v-if="cartItems.length === 0" class="flex flex-col items-center justify-center h-full text-center py-20">
              <span class="material-symbols-outlined text-6xl text-stone-200 mb-6 italic">shopping_bag</span>
              <p class="text-stone-600 font-body text-lg italic mb-4">Your bag is empty</p>
              <NuxtLink
                to="/products"
                @click="close"
                class="px-8 py-3 bg-primary text-white rounded-full font-label text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-stone-900 transition-all"
              >
                Start Shopping
              </NuxtLink>
            </div>

            <div v-else class="space-y-6">
              <div
                v-for="item in cartItems"
                :key="item.id"
                class="flex gap-4 p-4 bg-stone-50 rounded-2xl"
              >
                <div class="w-20 h-24 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-stone-100">
                  <img
                    v-if="item.image"
                    :src="item.image"
                    :alt="item.name"
                    loading="lazy"
                    decoding="async"
                    class="w-full h-full object-contain p-2"
                  />
                </div>

                <div class="flex-1 min-w-0">
                  <h3 class="font-serif font-bold text-stone-900 mb-1 truncate">{{ item.name }}</h3>
                  <p class="text-sm font-bold text-stone-600 mb-3">
                    {{ settings?.currency || 'EGP' }} {{ item.price.toFixed(0) }}
                  </p>

                  <div class="flex items-center gap-3">
                    <button
                      @click="updateQuantity(item.id, item.quantity - 1)"
                      class="w-8 h-8 flex items-center justify-center bg-white border border-stone-200 rounded-full hover:border-primary transition-colors mobile-touch-target"
                      aria-label="Decrease quantity"
                    >
                      <span class="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span class="font-bold text-stone-900 w-8 text-center">{{ item.quantity }}</span>
                    <button
                      @click="updateQuantity(item.id, item.quantity + 1)"
                      class="w-8 h-8 flex items-center justify-center bg-white border border-stone-200 rounded-full hover:border-primary transition-colors mobile-touch-target"
                      aria-label="Increase quantity"
                    >
                      <span class="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>

                <button
                  @click="removeFromCart(item.id)"
                  class="self-start p-2 text-stone-400 hover:text-red-500 transition-colors"
                  aria-label="Remove item"
                >
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div v-if="cartItems.length > 0" class="border-t border-stone-100 p-6 space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm font-bold text-stone-600 uppercase tracking-wider">Subtotal</span>
              <span class="text-xl font-serif font-bold text-stone-900">
                {{ settings?.currency || 'EGP' }} {{ cartTotal.toFixed(0) }}
              </span>
            </div>

            <NuxtLink
              to="/checkout"
              @click="close"
              class="block w-full py-4 bg-primary text-white rounded-full font-label text-[11px] font-bold uppercase tracking-[0.4em] text-center hover:bg-stone-900 transition-all shadow-lg shadow-primary/20"
            >
              Proceed to Checkout
            </NuxtLink>

            <p class="text-xs text-center text-stone-500 italic">
              Shipping and taxes calculated at checkout
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart()
const { settings } = useSettings()

const isOpen = defineModel<boolean>('open', { default: false })

const close = () => {
  isOpen.value = false
}
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .absolute.right-0,
.drawer-leave-to .absolute.right-0 {
  transform: translateX(100%);
}

.drawer-enter-to .absolute.right-0,
.drawer-leave-from .absolute.right-0 {
  transform: translateX(0);
}
</style>
