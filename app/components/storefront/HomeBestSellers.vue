<template>
  <section class="py-24 bg-stone-50 overflow-hidden">
    <div class="max-w-screen-2xl mx-auto px-12">
      <!-- Skeleton Loading State -->
      <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        <div v-for="i in 10" :key="i" class="animate-pulse">
          <div class="aspect-[3/4] bg-stone-100 rounded-xl mb-4"></div>
          <div class="h-4 bg-stone-100 rounded w-2/3 mb-2"></div>
          <div class="h-4 bg-stone-100 rounded w-1/3"></div>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-16">
        <div v-for="product in products" :key="product.id" class="group">
          <NuxtLink :to="`/products/${product.slug}`">
            <div class="relative aspect-[3/4] bg-white rounded-xl overflow-hidden mb-6 shadow-sm border border-stone-100 group-hover:shadow-xl group-hover:shadow-primary/5 transition-all duration-500">
              <img 
                v-if="product.images?.[0]"
                :src="product.images[0]"
                class="w-full h-full object-cover p-2 transition-transform duration-700 group-hover:scale-105"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-stone-100">
                <span class="material-symbols-outlined text-stone-300 text-4xl">image</span>
              </div>
              
              <!-- Quick Add Hover Overlay -->
              <div class="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                 <button class="px-6 py-3 bg-white text-stone-900 rounded font-label text-[10px] uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 font-bold hover:bg-primary hover:text-white">
                   View Details
                 </button>
              </div>

              <!-- Badges -->
              <div class="absolute top-4 left-4 flex flex-col gap-2">
                <span v-if="product.discount" class="bg-primary text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-lg">
                  -{{ product.discount }}% Off
                </span>
                <span v-if="product.isFeatured" class="bg-stone-900 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-lg">
                  Limited
                </span>
              </div>
            </div>

            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-body text-base font-medium text-stone-800">{{ product.name }}</h3>
                <p class="text-[10px] text-stone-400 uppercase tracking-widest mt-1">{{ product.category?.name || 'Editorial' }}</p>
              </div>
              <div class="text-right">
                <p v-if="product.discount" class="text-xs text-stone-400 line-through mb-1">{{ settings?.currency || 'EGP' }} {{ (product.price).toFixed(0) }}</p>
                <p class="font-body font-bold text-stone-900">{{ settings?.currency || 'EGP' }} {{ calculateDiscountedPrice(product).toFixed(0) }}</p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { settings } = useSettings()

// Fetch latest 10 products
const { data: products, pending } = await useApiFetch<any[]>('/api/products', {
  query: { limit: 10, sort: 'newest' }
})

const calculateDiscountedPrice = (product: any) => {
  if (product.discount) {
    return product.price * (1 - product.discount / 100)
  }
  return product.price
}
</script>
