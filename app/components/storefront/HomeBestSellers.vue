<template>
  <section class="py-32 bg-white">
    <div class="max-w-screen-2xl mx-auto px-6 md:px-12 space-y-24">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row justify-between items-end gap-8">
        <div class="space-y-6">
          <span class="text-[10px] uppercase tracking-[0.6em] text-primary font-bold italic">Curated Intel</span>
          <h2 class="text-4xl md:text-6xl font-serif italic text-stone-900 tracking-tight font-bold">Featured Selections</h2>
        </div>
        <NuxtLink to="/products" class="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-900 border-b border-stone-200 pb-2 hover:border-primary transition-all">View All Collections</NuxtLink>
      </div>

      <!-- Skeleton Loading State -->
      <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        <div v-for="i in 4" :key="i" class="animate-pulse space-y-6">
          <div class="aspect-[3/4] bg-stone-50 rounded-[2.5rem]"></div>
          <div class="h-6 bg-stone-50 rounded-full w-2/3 mx-auto"></div>
          <div class="h-4 bg-stone-50 rounded-full w-1/3 mx-auto"></div>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24">
        <div v-for="product in products" :key="product.id" class="group animate-stagger">
          <NuxtLink :to="`/products/${product.slug}`" class="block space-y-8">
            <div class="relative aspect-[3/4] bg-stone-50/50 rounded-[2.5rem] overflow-hidden border border-stone-100 group-hover:shadow-3xl transition-all duration-1000 group-hover:-translate-y-2">
              <img 
                v-if="product.images?.[0]"
                :src="product.images[0]"
                class="w-full h-full object-contain p-8 transition-all duration-[2s] group-hover:scale-110"
              />
              
              <!-- Refined Badges -->
              <div class="absolute top-6 left-6 flex flex-col gap-3">
                <span v-if="product.discount" class="bg-primary text-white text-[8px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">
                  {{ product.discount }}% Relief
                </span>
                <span v-if="product.isFeatured" class="bg-stone-900/10 backdrop-blur-md text-stone-900 text-[8px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-stone-900/5">
                  Essential
                </span>
              </div>

              <!-- Quick View Hint -->
              <div class="absolute inset-0 bg-stone-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <span class="text-[9px] uppercase tracking-[0.5em] font-bold text-white bg-stone-900/20 backdrop-blur-md px-6 py-3 rounded-full transform translate-y-10 group-hover:translate-y-0 transition-all duration-700">Open Intel</span>
              </div>
            </div>

            <div class="text-center space-y-3 px-4">
               <p class="text-[9px] text-stone-300 uppercase tracking-[0.4em] font-bold italic">{{ product.category?.name || 'Editorial' }}</p>
               <h3 class="font-serif text-2xl font-bold italic text-stone-900 transition-colors group-hover:text-primary tracking-tight">{{ product.name }}</h3>
               <div class="flex items-center justify-center gap-4">
                  <p v-if="product.discount" class="text-xs text-stone-300 line-through tabular-nums italic font-serif">{{ settings?.currency || 'EGP' }} {{ (product.price).toFixed(0) }}</p>
                  <p class="font-body font-bold text-stone-900 text-lg tabular-nums">{{ settings?.currency || 'EGP' }} {{ calculateDiscountedPrice(product).toFixed(0) }}</p>
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

// Fetch latest 8 products for the editorial grid
const { data: products, pending } = await useApiFetch<any[]>('/api/products', {
  query: { limit: 8, sort: 'newest' }
})

const calculateDiscountedPrice = (product: any) => {
  if (product.discount) {
    return product.price * (1 - product.discount / 100)
  }
  return product.price
}
</script>
