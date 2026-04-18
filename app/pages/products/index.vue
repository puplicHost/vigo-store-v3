<template>
  <div class="min-h-screen bg-surface text-on-surface">
    <main class="pt-32 pb-20 px-12 max-w-screen-2xl mx-auto">
      <!-- Header Section -->
      <section class="mb-12">
        <nav class="flex text-xs uppercase tracking-[0.15em] text-outline mb-4 font-label">
          <NuxtLink to="/" class="hover:text-primary transition-colors">Home</NuxtLink>
          <span class="mx-2">/</span>
          <span class="text-on-surface">Collections</span>
        </nav>
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 class="text-5xl md:text-6xl font-serif tracking-tighter text-on-surface">Collections</h1>
            <p class="mt-4 text-secondary max-w-md font-body leading-relaxed">Discover our latest editorial collection, where artisanal heritage meets modern silhouette.</p>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-xs font-label uppercase tracking-widest text-outline">Sort By</span>
            <div class="relative group">
              <button class="flex items-center gap-2 border-b border-outline-variant py-1 font-body text-sm hover:border-primary transition-all">
                <span>Newest First</span>
                <span class="material-symbols-outlined text-sm">expand_more</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div class="flex flex-col md:flex-row gap-16">
        <!-- Sidebar Filters -->
        <aside class="w-full md:w-64 flex-shrink-0">
          <div class="sticky top-40 space-y-10">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-label uppercase tracking-widest font-semibold">Filters</h3>
              <button class="text-xs font-label uppercase tracking-widest text-primary underline underline-offset-4 opacity-70 hover:opacity-100 transition-opacity">Clear All</button>
            </div>
            <!-- Filter Category: Size -->
            <div>
              <h4 class="text-sm font-serif mb-4">Size</h4>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="size in ['XS', 'S', 'M', 'L', 'XL']"
                  :key="size"
                  @click="selectedSize = selectedSize === size ? null : size"
                  :class="[
                    'border py-2 text-xs font-label transition-colors',
                    selectedSize === size
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-outline-variant hover:border-primary'
                  ]"
                >
                  {{ size }}
                </button>
              </div>
            </div>
            <!-- Filter Category: Color -->
            <div>
              <h4 class="text-sm font-serif mb-4">Color</h4>
              <div class="space-y-3">
                <label class="flex items-center gap-3 cursor-pointer group">
                  <span class="w-4 h-4 rounded-full bg-stone-900 ring-offset-2 ring-1 ring-transparent group-hover:ring-outline-variant transition-all"></span>
                  <span class="text-sm font-body text-secondary group-hover:text-on-surface">Obsidian</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer group">
                  <span class="w-4 h-4 rounded-full bg-[#D2B48C] ring-offset-2 ring-1 ring-transparent group-hover:ring-outline-variant transition-all"></span>
                  <span class="text-sm font-body text-secondary group-hover:text-on-surface">Sandstone</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer group">
                  <span class="w-4 h-4 rounded-full bg-[#F5F5DC] ring-offset-2 ring-1 ring-transparent group-hover:ring-outline-variant transition-all"></span>
                  <span class="text-sm font-body text-secondary group-hover:text-on-surface">Ecru</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        <!-- Product Grid -->
        <div class="flex-1">
          <ClientOnly>
            <template #fallback>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                <div v-for="i in 6" :key="i" class="animate-pulse">
                  <div class="aspect-[3/4] rounded-md bg-surface-container mb-6"></div>
                  <div class="h-5 bg-surface-container rounded mb-2"></div>
                  <div class="h-4 bg-surface-container rounded w-1/2"></div>
                </div>
              </div>
            </template>
            <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              <div v-for="i in 6" :key="i" class="animate-pulse">
                <div class="aspect-[3/4] rounded-md bg-surface-container mb-6"></div>
                <div class="h-5 bg-surface-container rounded mb-2"></div>
                <div class="h-4 bg-surface-container rounded w-1/2"></div>
              </div>
            </div>
            <div v-else-if="error" class="text-center text-error py-20">Failed to load products</div>
            <div v-else-if="!filteredProducts?.length" class="text-center text-on-surface-variant py-20">No products found</div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              <NuxtLink
                v-for="product in filteredProducts"
                :key="product.id"
                :to="`/products/${product.slug}`"
                class="group cursor-pointer"
              >
                <div class="relative aspect-[3/4] overflow-hidden rounded-md bg-surface-container-low">
                  <img 
                    v-if="product.images?.[0]" 
                    :src="product.images[0]" 
                    :alt="product.name"
                    class="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center bg-surface-container">
                    <span class="material-symbols-outlined text-on-surface-variant/30">image</span>
                  </div>
                  <div v-if="product.isFeatured" class="absolute bottom-4 left-4">
                    <div class="bg-surface/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-label uppercase tracking-widest text-on-surface">New Arrival</div>
                  </div>
                </div>
                <div class="mt-6 flex justify-between items-start">
                  <div>
                    <h3 class="font-serif text-lg group-hover:text-primary transition-colors">{{ product.name }}</h3>
                    <p class="text-sm text-secondary font-body mt-1">{{ product.category?.name || 'Uncategorized' }}</p>
                  </div>
                  <p class="font-body text-sm font-semibold tracking-tight text-on-surface">{{ settings?.currency || 'EGP' }} {{ (product.price ?? 0).toFixed(2) }}</p>
                </div>
                <div v-if="product.colors?.length" class="mt-4 flex gap-2">
                  <span 
                    v-for="color in product.colors.slice(0, 3)" 
                    :key="color"
                    class="w-3 h-3 rounded-full ring-1 ring-offset-1 ring-outline"
                    :style="{ backgroundColor: color }"
                  ></span>
                </div>
              </NuxtLink>
            </div>
          </ClientOnly>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated, user } = useAuth()
const { settings } = useSettings()
const { lastRefreshEvent } = useDataRefresh()

// Size filter state
const selectedSize = ref<string | null>(null)

// Fetch products
const { data: productsData, pending, error, refresh } = await useFetch<any>('/api/products', {
  default: () => ({ items: [] })
})

// Auto-refresh when admin makes changes (synced across tabs)
watch(() => lastRefreshEvent.value, (event) => {
  if (event?.dataType === 'products') {
    refresh()
  }
})

// Filter products by selected size
const filteredProducts = computed(() => {
  const items = productsData.value?.items || []
  if (!selectedSize.value) return items
  return items.filter((product: any) =>
    product.sizes?.includes(selectedSize.value)
  )
})
</script>
