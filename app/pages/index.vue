<template>
  <div class="min-h-screen bg-surface text-on-surface">
    <main class="pt-24">
      <!-- Hero Section -->
      <section class="relative h-[921px] flex items-center px-12 overflow-hidden">
        <div class="absolute inset-0 z-0">
          <img 
            alt="Luxury Editorial" 
            class="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&q=80"
          />
          <div class="absolute inset-0 bg-stone-900/10"></div>
        </div>
        <div class="relative z-10 max-w-3xl">
          <h1 class="text-6xl md:text-8xl font-serif font-bold text-on-surface leading-[1.1] -tracking-widest mb-8">
            The Art of <br/><span class="italic font-normal">Pure Form</span>
          </h1>
          <p class="font-body text-lg text-on-surface-variant max-w-md mb-10 leading-relaxed">
            Explore our curated winter collection, where traditional craftsmanship meets avant-garde minimalist design.
          </p>
          <NuxtLink 
            to="/products" 
            class="inline-flex items-center px-10 py-4 rounded-lg hero-gradient text-on-primary font-body font-semibold tracking-wide transition-transform hover:scale-[1.02]"
          >
            Shop Collection
          </NuxtLink>
        </div>
      </section>

      <!-- The Collection (Product Grid) -->
      <section class="py-24 bg-surface-container-low">
        <div class="max-w-screen-2xl mx-auto px-12">
          <div class="flex justify-between items-end mb-16">
            <div>
              <span class="uppercase tracking-[0.2em] text-xs font-label text-primary font-bold">Curated Selection</span>
              <h2 class="text-5xl font-serif mt-4">The Collection</h2>
            </div>
            <NuxtLink to="/products" class="font-label text-sm uppercase tracking-widest border-b border-primary pb-2">View All Pieces</NuxtLink>
          </div>
          <ClientOnly>
            <template #fallback>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div v-for="i in 4" :key="i" class="animate-pulse">
                  <div class="aspect-[3/4] rounded-lg bg-surface-container mb-4"></div>
                  <div class="h-4 bg-surface-container rounded mb-2"></div>
                  <div class="h-3 bg-surface-container rounded w-1/2"></div>
                </div>
              </div>
            </template>
            <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div v-for="i in 4" :key="i" class="animate-pulse">
                <div class="aspect-[3/4] rounded-lg bg-surface-container mb-4"></div>
                <div class="h-4 bg-surface-container rounded mb-2"></div>
                <div class="h-3 bg-surface-container rounded w-1/2"></div>
              </div>
            </div>
            <div v-else-if="error" class="text-center text-error">Failed to load products</div>
            <div v-else-if="!featuredProducts?.length" class="text-center text-on-surface-variant">No products found</div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div v-for="product in featuredProducts" :key="product.id" class="group">
                <NuxtLink :to="`/products/${product.slug}`">
                  <div class="relative aspect-[3/4] rounded-lg overflow-hidden bg-white mb-4">
                    <img 
                      v-if="product.images?.[0]" 
                      :src="product.images[0]" 
                      :alt="product.name"
                      class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center bg-surface-container">
                      <span class="material-symbols-outlined text-on-surface-variant/30">image</span>
                    </div>
                    <div v-if="product.isFeatured" class="absolute top-4 right-4 bg-white/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold">New</div>
                  </div>
                  <h4 class="font-body text-base font-medium">{{ product.name }}</h4>
                  <p class="font-body text-sm text-on-surface-variant mt-1">{{ settings?.currency || 'EGP' }} {{ (product.price ?? 0).toFixed(2) }}</p>
                </NuxtLink>
              </div>
            </div>
          </ClientOnly>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated, user } = useAuth()
const { lastRefreshEvent } = useDataRefresh()
const { settings } = useSettings()

// Fetch featured products for the homepage
const { data: productsData, pending, error, refresh } = await useFetch<any>('/api/products', {
  default: () => ({ items: [] }),
  query: { limit: 4 }
})

// Auto-refresh when admin makes changes (synced across tabs)
watch(() => lastRefreshEvent.value, (event) => {
  if (event?.dataType === 'products') {
    refresh()
  }
})

// Get first 4 products as featured
const featuredProducts = computed(() => {
  return productsData.value?.items || []
})
</script>

<style scoped>
.hero-gradient {
  background: linear-gradient(135deg, #775a19 0%, #c5a059 100%);
}
</style>
