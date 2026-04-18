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
            <div class="relative">
              <select 
                v-model="sortBy"
                class="appearance-none bg-transparent border-b border-outline-variant/30 pr-8 py-1 font-body text-sm hover:border-primary transition-all focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <span class="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-sm pointer-events-none">expand_more</span>
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
              <button 
                @click="clearAll"
                class="text-xs font-label uppercase tracking-widest text-primary underline underline-offset-4 opacity-70 hover:opacity-100 transition-opacity"
              >
                Clear All
              </button>
            </div>

            <!-- Filter: Price Range -->
            <div>
              <h4 class="text-sm font-serif mb-4">Price Range</h4>
              <div class="space-y-4">
                <div class="flex items-center gap-2">
                  <input 
                    v-model.number="priceRange[0]" 
                    type="number" 
                    placeholder="Min"
                    class="w-full bg-stone-50 border border-outline-variant/30 rounded py-2 px-3 text-xs font-body"
                  />
                  <span class="text-stone-300">-</span>
                  <input 
                    v-model.number="priceRange[1]" 
                    type="number" 
                    placeholder="Max"
                    class="w-full bg-stone-50 border border-outline-variant/30 rounded py-2 px-3 text-xs font-body"
                  />
                </div>
                <!-- Simple Slider (Visual representation) -->
                <div class="relative h-1 bg-stone-100 rounded-full">
                   <div class="absolute h-full bg-primary rounded-full w-full opacity-30"></div>
                </div>
              </div>
            </div>

            <!-- Filter Category: Size -->
            <div>
              <h4 class="text-sm font-serif mb-4">Size</h4>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="size in ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']"
                  :key="size"
                  @click="selectedSize = selectedSize === size ? null : size"
                  :class="[
                    'border py-2 text-xs font-label transition-colors',
                    selectedSize === size
                      ? 'border-primary bg-primary/10 text-primary font-bold'
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
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="color in availableColors"
                  :key="color"
                  @click="toggleColor(color)"
                  class="group flex flex-col items-center gap-2"
                >
                  <div 
                    class="w-8 h-8 rounded-full border-2 transition-all p-0.5"
                    :class="selectedColors.includes(color) ? 'border-primary' : 'border-transparent group-hover:border-stone-200'"
                  >
                    <div class="w-full h-full rounded-full border border-stone-200" :style="{ backgroundColor: color }"></div>
                  </div>
                  <span class="text-[9px] uppercase tracking-widest text-stone-400 group-hover:text-stone-900 transition-colors">{{ color }}</span>
                </button>
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
const { settings } = useSettings()
const { lastRefreshEvent } = useDataRefresh()
const route = useRoute()

// Filter states
const selectedSize = ref<string | null>(null)
const selectedColors = ref<string[]>([])
const priceRange = ref([0, 10000])
const sortBy = ref('newest')

// Fetch products
const { data: productsData, pending, error, refresh } = await useFetch<any>('/api/products', {
  default: () => ({ items: [] })
})

// Auto-refresh when admin makes changes
watch(() => lastRefreshEvent.value, (event) => {
  if (event?.dataType === 'products') refresh()
})

const categories = computed(() => {
  const items = productsData.value?.items || []
  const cats = items.map((p: any) => p.category?.name).filter(Boolean)
  return [...new Set(cats)]
})

const availableColors = computed(() => {
  const items = productsData.value?.items || []
  const colors = items.flatMap((p: any) => p.colors || [])
  return [...new Set(colors)]
})

// Combined Filtered and Sorted Products
const filteredProducts = computed(() => {
  let items = [...(productsData.value?.items || [])]

  // Filter by Category (from URL)
  if (route.query.category) {
    items = items.filter(p => p.categoryId === route.query.category)
  }

  // Filter by Size
  if (selectedSize.value) {
    items = items.filter(p => p.sizes?.includes(selectedSize.value))
  }

  // Filter by Color
  if (selectedColors.value.length > 0) {
    items = items.filter(p => p.colors?.some((c: string) => selectedColors.value.includes(c)))
  }

  // Filter by Price
  items = items.filter(p => p.price >= priceRange.value[0] && p.price <= priceRange.value[1])

  // Sorting
  switch (sortBy.value) {
    case 'price-low':
      items.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      items.sort((a, b) => b.price - a.price)
      break
    case 'oldest':
      items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      break
    case 'newest':
    default:
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  return items
})

const toggleColor = (color: string) => {
  const idx = selectedColors.value.indexOf(color)
  if (idx >= 0) selectedColors.value.splice(idx, 1)
  else selectedColors.value.push(color)
}

const clearAll = () => {
  selectedSize.value = null
  selectedColors.value = []
  priceRange.value = [0, 10000]
  sortBy.value = 'newest'
}
</script>
