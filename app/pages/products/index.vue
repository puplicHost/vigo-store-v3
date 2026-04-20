<template>
  <div class="min-h-screen bg-[#fafafa] text-[#1c1b1b]">
    <main class="pt-24 pb-24 px-8 md:px-12 max-w-[1400px] mx-auto">
      
      <!-- Breadcrumbs & Header -->
      <header class="mb-14">
        <div class="relative flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#eae8e4] pb-10">
          <div class="max-w-2xl">
            <nav class="mb-6 text-[9px] uppercase tracking-[0.2em] text-[#a09e99]">
              <NuxtLink to="/" class="hover:text-[#1c1b1b] transition-colors">HOME</NuxtLink>
              <span class="mx-2">/</span>
              <span class="text-[#1c1b1b]">NEW ARRIVALS</span>
            </nav>
            <h1 class="font-serif text-5xl md:text-6xl text-[#1c1b1b] mb-4">New Arrivals</h1>
            <p class="text-[13px] text-[#5c5a55] font-body max-w-sm leading-relaxed">
              Discover our latest editorial collection, where artisanal heritage meets modern silhouette.
            </p>
          </div>
          
          <div class="flex items-center gap-3 self-start md:self-end">
            <span class="text-[9px] uppercase tracking-[0.2em] text-[#a09e99]">SORT BY</span>
            <div class="relative group">
              <select 
                v-model="sortBy"
                class="appearance-none bg-transparent border-b border-[#d4d2ce] pr-6 py-1 text-[11px] font-medium text-[#1c1b1b] hover:border-[#1c1b1b] transition-all focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Archival Pieces</option>
                <option value="price-low">Value: Ascending</option>
                <option value="price-high">Value: Descending</option>
              </select>
              <span class="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-sm text-[#8c8a85] pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>
      </header>

      <div class="flex flex-col lg:flex-row gap-12 lg:gap-20">
        <!-- Sidebar Filters -->
        <aside class="w-full lg:w-56 flex-shrink-0">
          <div class="sticky top-32 space-y-12">
            <div class="flex items-center justify-between border-b border-[#eae8e4] pb-6 mb-8">
              <h3 class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1c1b1b]">FILTERS</h3>
              <button @click="clearAll" class="text-[9px] uppercase tracking-[0.1em] text-[#a09e99] hover:text-[#1c1b1b] border-b border-[#a09e99] hover:border-[#1c1b1b] pb-0.5 transition-colors">
                CLEAR ALL
              </button>
            </div>

            <!-- Filter: Size -->
            <div class="pb-6 border-b border-[#eae8e4]">
              <h4 class="text-[12px] text-[#1c1b1b] mb-4 font-body font-medium">Size</h4>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="size in ['XS', 'S', 'M', 'L', 'XL']"
                  :key="size"
                  @click="selectedSize = selectedSize === size ? null : size"
                  :class="[
                    'h-9 text-[10px] transition-all flex items-center justify-center font-body group',
                    selectedSize === size
                      ? 'border border-[#1c1b1b] text-[#1c1b1b]'
                      : 'border border-[#e2e0dc] text-[#5c5a55] hover:border-[#b4b2ac]'
                  ]"
                >
                  <span class="group-hover:text-[#1c1b1b] transition-colors">{{ size }}</span>
                </button>
              </div>
            </div>

            <!-- Filter: Color -->
            <div v-if="availableColors.length" class="pb-6 border-b border-[#eae8e4]">
              <h4 class="text-[12px] text-[#1c1b1b] mb-4 font-body font-medium">Color</h4>
              <div class="flex flex-col gap-3 font-body">
                <button
                  v-for="color in availableColors"
                  :key="color"
                  @click="toggleColor(color)"
                  class="flex items-center gap-3 group text-left"
                >
                  <div 
                    class="w-[18px] h-[18px] rounded-full border transition-all flex items-center justify-center"
                    :class="selectedColors.includes(color) ? 'border-[#1c1b1b]' : 'border-transparent group-hover:border-[#d4d2ce]'"
                  >
                    <div class="w-3 h-3 rounded-full shadow-sm ring-1 ring-black/5" :style="{ backgroundColor: color }"></div>
                  </div>
                  <span 
                    class="text-[12px] transition-colors capitalize"
                    :class="selectedColors.includes(color) ? 'text-[#1c1b1b] font-medium' : 'text-[#8c8a85] group-hover:text-[#5c5a55]'"
                  >
                    {{ colorMap[color.toLowerCase()] || color }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Filter: Material -->
            <div>
              <h4 class="text-[12px] text-[#1c1b1b] mb-4 font-body font-medium">Material</h4>
              <div class="flex flex-col gap-3 font-body">
                <label 
                  v-for="mat in materials" 
                  :key="mat"
                  class="flex items-center gap-3 cursor-pointer group"
                >
                  <div class="relative flex items-center justify-center w-3.5 h-3.5 border transition-colors shadow-sm"
                       :class="selectedMaterials.includes(mat) ? 'border-[#a68648] bg-[#a68648]' : 'border-[#d4d2ce] group-hover:border-[#a09e99]'">
                    <span v-if="selectedMaterials.includes(mat)" class="material-symbols-outlined text-[10px] text-white">check</span>
                  </div>
                  <input type="checkbox" :value="mat" v-model="selectedMaterials" class="hidden" />
                  <span class="text-[12px] text-[#8c8a85] group-hover:text-[#5c5a55] transition-colors" :class="{'text-[#1c1b1b] font-medium': selectedMaterials.includes(mat)}">{{ mat }}</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        <!-- Product Grid -->
        <div class="flex-1">
          <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
            <div v-for="i in 6" :key="i" class="animate-pulse">
              <div class="aspect-[3/4] bg-[#f2f0ec] mb-4"></div>
              <div class="h-4 bg-[#f2f0ec] w-2/3 mb-2"></div>
              <div class="h-4 bg-[#f2f0ec] w-1/3"></div>
            </div>
          </div>
          
          <div v-else-if="!filteredProducts?.length" class="flex flex-col items-center justify-center py-40 text-center border border-dashed border-[#e2e0dc]">
            <span class="material-symbols-outlined text-4xl text-[#d4d2ce] mb-6 font-light">search_off</span>
            <p class="text-[#8c8a85] font-serif italic text-lg">No pieces found matching your criteria.</p>
            <button @click="clearAll" class="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1c1b1b] border-b border-[#1c1b1b] pb-1">Reset Filters</button>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            <NuxtLink
              v-for="(product, idx) in filteredProducts"
              :key="product.id"
              :to="`/products/${product.slug}`"
              class="group block"
            >
              <div class="relative aspect-[3/4] bg-[#f8f8f8] overflow-hidden mb-5">
                <img 
                  v-if="product.images?.[0]" 
                  :src="product.images[0]" 
                  :alt="product.name"
                  class="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                />
                <div v-else class="w-full h-full bg-[#e8e6e1] flex items-center justify-center">
                  <span class="text-[#a09e99] text-xs font-serif italic">Vigo</span>
                </div>
                
                <!-- NEW ARRIVAL Badge -->
                <div v-if="idx < 3" class="absolute bottom-4 left-4 bg-white/95 px-3 py-1.5 shadow-sm">
                  <span class="text-[8px] font-bold uppercase tracking-[0.2em] text-[#1c1b1b]">New Arrival</span>
                </div>
              </div>

              <div>
                <div class="flex justify-between items-start gap-4 mb-1">
                  <h3 class="text-[15px] font-serif font-medium text-[#1c1b1b] leading-tight group-hover:text-[#5c5a55] transition-colors line-clamp-1">
                    {{ product.name }}
                  </h3>
                  <div class="text-right flex-shrink-0 pt-0.5">
                    <p class="text-[11px] font-medium text-[#1c1b1b] tracking-wide">${{ calculatePrice(product).toFixed(0) }}</p>
                  </div>
                </div>
                
                <!-- Subtitle / Colors text -->
                <p class="text-[11px] text-[#5c5a55] mb-3 truncate">
                  {{ product.colors && product.colors.length > 0 ? product.colors.map((c: string) => colorMap[c.toLowerCase()] || c).join(' / ') : 'Sandstone / White' }}
                </p>

                <!-- Color palette indicator -->
                <div v-if="product.colors?.length" class="flex gap-2">
                  <div 
                    v-for="(color, colorIdx) in product.colors.slice(0, 3)" 
                    :key="color"
                    class="relative"
                  >
                    <!-- A slightly larger ring outline for the first color for focus simulation as in design -->
                    <div v-if="colorIdx === 0" class="absolute -inset-[3px] rounded-full ring-[0.5px] ring-[#d4d2ce]"></div>
                    <div 
                      class="w-2.5 h-2.5 rounded-full ring-1 ring-black/5 shadow-inner"
                      :style="{ backgroundColor: color }"
                    ></div>
                  </div>
                  <!-- Simulated second color matching design spacing -->
                  <div v-if="product.colors.length === 1" class="relative">
                     <div class="w-2.5 h-2.5 rounded-full ring-1 ring-[#eae8e4] bg-[#fafafa]"></div>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </div>
          
          <!-- Pagination / Load More Area -->
          <div v-if="filteredProducts?.length" class="mt-24 pt-10 flex flex-col items-center border-t border-[#eae8e4]/50">
            <button class="bg-[#a68648] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-3.5 rounded-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#a68648]/20 transition-all">
              LOAD MORE DESIGNS
            </button>
            <div class="flex items-center gap-5 mt-10 font-body text-[10px] tracking-widest text-[#a09e99]">
              <div class="w-12 h-px bg-[#eae8e4]"></div>
              <span class="text-[#1c1b1b] font-bold">01</span>
              <span class="hover:text-[#5c5a55] cursor-pointer transition-colors">02</span>
              <span class="hover:text-[#5c5a55] cursor-pointer transition-colors">03</span>
              <div class="w-12 h-px bg-[#eae8e4]"></div>
            </div>
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

// New filter state for Material UI
const selectedMaterials = ref<string[]>([])
const materials = ['Organic Silk', 'Raw Linen', 'Merino Wool']

// Helper formatting map
const colorMap: Record<string, string> = {
  '#000000': 'Obsidian',
  'black': 'Obsidian',
  '#333333': 'Charcoal',
  '#d2b48c': 'Sandstone',
  '#c2b280': 'Ecru',
  '#f5f5f5': 'Cream',
  '#ffffff': 'White',
  'white': 'White',
  '#87ceeb': 'Sky Blue'
}

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
