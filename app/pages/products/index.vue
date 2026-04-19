<template>
  <div class="min-h-screen bg-stone-50 text-stone-900 border-t border-stone-100">
    <main class="pt-32 pb-24 px-8 md:px-16 max-w-screen-2xl mx-auto">
      
      <!-- Minimalist Search Header -->
      <header class="mb-20">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-12 border-b border-stone-200 pb-12">
          <div class="relative flex-1 max-w-2xl group">
            <span class="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-primary transition-colors">search</span>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search our collection..."
              class="w-full bg-transparent border-none pl-10 py-4 font-serif italic text-3xl md:text-5xl placeholder:text-stone-200 focus:outline-none focus:ring-0 transition-all"
            />
          </div>
          
          <div class="flex items-center gap-10">
            <div class="flex flex-col gap-2">
              <span class="text-[9px] uppercase tracking-[0.3em] text-stone-400 font-bold">Sort Intelligence</span>
              <div class="relative group">
                <select 
                  v-model="sortBy"
                  class="appearance-none bg-transparent border-b border-stone-200 pr-10 py-2 font-serif italic text-lg hover:border-primary transition-all focus:outline-none cursor-pointer"
                >
                  <option value="newest">Arrived Recently</option>
                  <option value="oldest">Archival Pieces</option>
                  <option value="price-low">Value: Ascending</option>
                  <option value="price-high">Value: Descending</option>
                </select>
                <span class="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-lg text-stone-300 pointer-events-none group-hover:text-primary transition-colors">unfold_more</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="flex flex-col lg:flex-row gap-20">
        <!-- Minimalist Sidebar Filters -->
        <aside class="w-full lg:w-72 flex-shrink-0">
          <div class="sticky top-40 space-y-16">
            <div class="flex items-center justify-between group cursor-pointer" @click="clearAll">
              <h3 class="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-900">Refine Selection</h3>
              <span class="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400 group-hover:text-primary transition-colors">Reset Filters</span>
            </div>

            <!-- Filter: Category -->
            <div v-if="categories.length > 1">
              <h4 class="text-xs font-serif italic mb-6">Collections</h4>
              <div class="flex flex-col gap-3">
                <NuxtLink 
                  to="/products"
                  class="text-sm transition-all flex items-center justify-between group"
                  :class="!route.query.category ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-600'"
                >
                  <span>All Pieces</span>
                </NuxtLink>
                <NuxtLink 
                  v-for="cat in categories"
                  :key="cat.id"
                  :to="{ path: '/products', query: { category: cat.id } }"
                  class="text-sm transition-all flex items-center justify-between group"
                  :class="route.query.category === cat.id ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-600'"
                >
                  <span>{{ cat.name }}</span>
                </NuxtLink>
              </div>
            </div>

            <!-- Filter: Price Range -->
            <div>
              <div class="flex justify-between items-baseline mb-6">
                <h4 class="text-xs font-serif italic">Value Palette</h4>
                <span class="text-[10px] text-stone-400 tabular-nums">{{ priceRange[0] }} — {{ priceRange[1] }}</span>
              </div>
              <div class="space-y-6">
                <div class="flex items-center gap-4">
                  <input 
                    v-model.number="priceRange[0]" 
                    type="range" min="0" max="20000" step="500"
                    class="w-full h-[2px] bg-stone-200 accent-primary appearance-none cursor-pointer"
                  />
                  <input 
                    v-model.number="priceRange[1]" 
                    type="range" min="0" max="20000" step="500"
                    class="w-full h-[2px] bg-stone-200 accent-primary appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <!-- Filter: Size Selection -->
            <div>
              <h4 class="text-xs font-serif italic mb-6">Proportions</h4>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="size in ['XS', 'S', 'M', 'L', 'XL', 'XXL']"
                  :key="size"
                  @click="selectedSize = selectedSize === size ? null : size"
                  :class="[
                    'h-10 text-[9px] font-bold transition-all border rounded-sm flex items-center justify-center',
                    selectedSize === size
                      ? 'border-stone-900 bg-stone-900 text-white shadow-lg shadow-black/10'
                      : 'border-stone-100 bg-white text-stone-400 hover:border-stone-300'
                  ]"
                >
                  {{ size }}
                </button>
              </div>
            </div>

            <!-- Filter: Tonal Palette -->
            <div v-if="availableColors.length">
              <h4 class="text-xs font-serif italic mb-6">Tonal Palette</h4>
              <div class="flex flex-wrap gap-4">
                <button
                  v-for="color in availableColors"
                  :key="color"
                  @click="toggleColor(color)"
                  class="group relative"
                >
                  <div 
                    class="w-6 h-6 rounded-full border border-stone-200 transition-all p-0.5"
                    :class="selectedColors.includes(color) ? 'scale-125 border-stone-900' : 'hover:scale-110'"
                  >
                    <div class="w-full h-full rounded-full" :style="{ backgroundColor: color }"></div>
                  </div>
                  <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[8px] uppercase tracking-tighter text-stone-500 font-bold">
                    {{ color }}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </aside>

        <!-- Refined Product Grid -->
        <div class="flex-1">
          <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-20">
            <div v-for="i in 6" :key="i" class="animate-pulse">
              <div class="aspect-[3/4] bg-stone-100 rounded-2xl mb-8"></div>
              <div class="h-4 bg-stone-100 rounded w-2/3 mb-4"></div>
              <div class="h-4 bg-stone-100 rounded w-1/3"></div>
            </div>
          </div>
          
          <div v-else-if="!filteredProducts?.length" class="flex flex-col items-center justify-center py-40 text-center border border-dashed border-stone-200 rounded-3xl">
            <span class="material-symbols-outlined text-4xl text-stone-100 mb-6 font-light italic">search_off</span>
            <p class="text-stone-400 font-serif italic text-lg">Your current selection yield no results.</p>
            <button @click="clearAll" class="mt-8 text-[10px] font-bold uppercase tracking-[0.3em] text-primary border-b border-primary/20 pb-1">Reset All</button>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-24">
            <NuxtLink
              v-for="product in filteredProducts"
              :key="product.id"
              :to="`/products/${product.slug}`"
              class="group block"
            >
              <div class="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white border border-stone-100 group-hover:shadow-3xl group-hover:shadow-stone-200/50 transition-all duration-700">
                <img 
                  v-if="product.images?.[0]" 
                  :src="product.images[0]" 
                  :alt="product.name"
                  class="w-full h-full object-contain p-6 transition-transform duration-[2s] ease-out group-hover:scale-110"
                />
                
                <div class="absolute inset-0 bg-stone-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <!-- Strategic Badges -->
                <div class="absolute top-6 left-6 flex flex-col gap-2">
                  <span v-if="product.discount" class="bg-primary text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-xl">
                    Exclusive -{{ product.discount }}% Off
                  </span>
                  <span v-if="product.isFeatured" class="bg-black text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-xl">
                    Vigo Editorial
                  </span>
                </div>

                <!-- Hover CTA -->
                <div class="absolute inset-x-6 bottom-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div class="bg-white/90 backdrop-blur-md py-4 text-center rounded-xl text-[9px] font-bold uppercase tracking-[0.3em] text-stone-900 shadow-2xl">
                    Reserve Selection
                  </div>
                </div>
              </div>

              <div class="mt-10 space-y-4">
                <div class="flex justify-between items-start gap-4">
                  <div class="flex-1">
                    <h3 class="text-xl font-serif font-bold text-stone-900 tracking-tight leading-tight group-hover:text-primary transition-colors">
                      {{ product.name }}
                    </h3>
                    <p class="text-[10px] text-stone-400 uppercase tracking-[0.2em] mt-3 font-bold">
                      {{ product.category?.name || 'Vigo Bespoke' }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p v-if="product.discount" class="text-stone-300 text-[10px] font-bold line-through mb-1 tracking-widest">{{ settings?.currency || 'EGP' }} {{ (product.price).toFixed(0) }}</p>
                    <p class="text-lg font-body font-bold text-stone-950 tracking-tighter tabular-nums">{{ settings?.currency || 'EGP' }} {{ calculatePrice(product).toFixed(0) }}</p>
                  </div>
                </div>
                
                <!-- Color palette indicator -->
                <div v-if="product.colors?.length" class="flex gap-2">
                  <div 
                    v-for="color in product.colors" 
                    :key="color"
                    class="w-2.5 h-2.5 rounded-full ring-offset-2 group-hover:ring-1 ring-stone-200 transition-all"
                    :style="{ backgroundColor: color }"
                  ></div>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { settings } = useSettings()
const route = useRoute()

// Filter states
const searchQuery = ref('')
const selectedSize = ref<string | null>(null)
const selectedColors = ref<string[]>([])
const priceRange = ref([0, 20000])
const sortBy = ref('newest')

// Fetch products
const { data: productsData, pending } = await useApiFetch<any>('/api/products', {
  query: computed(() => ({
    limit: 100,
    categoryId: route.query.category
  }))
})

// Extract available categories and colors
const categories = computed(() => {
  const allProds = productsData.value || []
  const uniqueCats = new Map()
  allProds.forEach((p: any) => {
    if (p.category && !uniqueCats.has(p.categoryId)) {
      uniqueCats.set(p.categoryId, p.category)
    }
  })
  return Array.from(uniqueCats.values())
})

const availableColors = computed(() => {
  const items = productsData.value || []
  const colors = items.flatMap((p: any) => p.colors || [])
  return [...new Set(colors)]
})

const calculatePrice = (product: any) => {
  if (product.discount) return product.price * (1 - product.discount / 100)
  return product.price
}

// Logic for local filtering and sorting
const filteredProducts = computed(() => {
  let items = [...(productsData.value || [])]

  // Name Search
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    items = items.filter(p => p.name.toLowerCase().includes(q))
  }

  if (selectedSize.value) {
    items = items.filter(p => p.sizes?.includes(selectedSize.value))
  }

  if (selectedColors.value.length > 0) {
    items = items.filter(p => p.colors?.some((c: string) => selectedColors.value.includes(c)))
  }

  items = items.filter(p => {
    const finalPrice = calculatePrice(p)
    return finalPrice >= priceRange.value[0] && finalPrice <= priceRange.value[1]
  })

  switch (sortBy.value) {
    case 'price-low': items.sort((a, b) => calculatePrice(a) - calculatePrice(b)); break
    case 'price-high': items.sort((a, b) => calculatePrice(b) - calculatePrice(a)); break
    case 'oldest': items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break
    case 'newest': default: items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
  }

  return items
})

const toggleColor = (color: string) => {
  const idx = selectedColors.value.indexOf(color)
  if (idx >= 0) selectedColors.value.splice(idx, 1)
  else selectedColors.value.push(color)
}

const clearAll = () => {
  searchQuery.value = ''
  selectedSize.value = null
  selectedColors.value = []
  priceRange.value = [0, 20000]
  sortBy.value = 'newest'
}
</script>

<style scoped>
input[type='range']::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  background: white;
  border: 1px solid #1c1917;
  border-radius: 50%;
  cursor: pointer;
}
</style>
