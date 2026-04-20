<template>
  <div class="min-h-screen bg-white text-stone-900 selection:bg-primary/10">
    <main class="pt-32 pb-24 px-6 md:px-12 max-w-screen-2xl mx-auto">
      
      <!-- Page Narrative -->
      <header class="mb-24 space-y-10">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-stone-100 pb-12">
          <div class="max-w-3xl space-y-8 animate-stagger">
            <nav class="text-[9px] uppercase tracking-[0.6em] text-stone-300 font-bold italic">
              <NuxtLink to="/" class="hover:text-primary transition-colors">Atelier Home</NuxtLink>
              <span class="mx-3 opacity-30">/</span>
              <span class="text-stone-900">Collections</span>
            </nav>
            <h1 class="font-serif text-6xl md:text-8xl text-stone-900 italic font-bold tracking-tight">The Collections</h1>
            <p class="text-sm text-stone-400 font-body max-w-md leading-relaxed italic">
              Explore our curated silhouette narrative. Precision-cut artisanal pieces designed for the modern individual who seeks aesthetic permanence.
            </p>
          </div>
          
          <div class="flex items-center gap-6 self-start md:self-end">
            <span class="text-[9px] uppercase tracking-[0.4em] text-stone-300 font-bold italic">Arrange by</span>
            <div class="relative group">
              <select 
                v-model="sortBy"
                class="appearance-none bg-transparent border-b border-stone-100 pr-10 py-2 text-[10px] font-bold text-stone-900 uppercase tracking-widest hover:border-primary transition-all focus:outline-none cursor-pointer"
              >
                <option value="newest">Latest arrivals</option>
                <option value="oldest">Archive first</option>
                <option value="price-low">Value: ascending</option>
                <option value="price-high">Value: descending</option>
              </select>
              <span class="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-sm text-stone-200 group-hover:text-primary transition-colors group-hover:translate-y-1">expand_more</span>
            </div>
          </div>
        </div>
      </header>

      <div class="flex flex-col lg:flex-row gap-20 xl:gap-32">
        <!-- Sidebar Filters -->
        <aside class="w-full lg:w-64 flex-shrink-0">
          <div class="sticky top-40 space-y-16 animate-stagger">
            <div class="flex items-center justify-between border-b border-stone-100 pb-8 mb-10">
              <h3 class="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-400 italic">Intel Filters</h3>
              <button @click="clearAll" class="text-[9px] uppercase tracking-[0.2em] text-primary font-bold hover:text-stone-900 transition-colors">
                Reset
              </button>
            </div>

            <!-- Filter: Size -->
            <div class="space-y-8">
              <h4 class="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-900 italic font-serif">Proportion</h4>
              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="size in ['XS', 'S', 'M', 'L', 'XL']"
                  :key="size"
                  @click="selectedSize = selectedSize === size ? null : size"
                  :class="[
                    'h-12 text-[10px] uppercase font-bold tracking-widest transition-all rounded-xl flex items-center justify-center border duration-500',
                    selectedSize === size
                      ? 'border-primary bg-primary text-white shadow-xl shadow-primary/20'
                      : 'border-stone-100 text-stone-400 hover:border-stone-300'
                  ]"
                >
                  {{ size }}
                </button>
              </div>
            </div>

            <!-- Filter: Color -->
            <div v-if="availableColors.length" class="space-y-8">
              <h4 class="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-900 italic font-serif">Palette</h4>
              <div class="flex flex-wrap gap-5">
                <button
                  v-for="color in availableColors"
                  :key="color"
                  @click="toggleColor(color)"
                  class="group relative"
                >
                  <div 
                    class="w-10 h-10 rounded-full border border-stone-100 flex items-center justify-center transition-all duration-500"
                    :class="selectedColors.includes(color) ? 'border-primary scale-110 shadow-lg ring-4 ring-primary/5' : 'hover:border-stone-300'"
                  >
                    <div class="w-7 h-7 rounded-full shadow-inner" :style="{ backgroundColor: color }"></div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Filter: Material -->
            <div class="space-y-8">
              <h4 class="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-900 italic font-serif">Textile Intelligence</h4>
              <div class="space-y-4">
                <label 
                  v-for="mat in materials" 
                  :key="mat"
                  class="flex items-center gap-4 cursor-pointer group"
                >
                  <div class="relative flex items-center justify-center w-5 h-5 border rounded transition-all duration-500"
                       :class="selectedMaterials.includes(mat) ? 'border-primary bg-primary shadow-lg shadow-primary/20' : 'border-stone-100 group-hover:border-stone-300'">
                    <span v-if="selectedMaterials.includes(mat)" class="material-symbols-outlined text-[12px] text-white italic">check</span>
                  </div>
                  <input type="checkbox" :value="mat" v-model="selectedMaterials" class="hidden" />
                  <span class="text-[11px] uppercase tracking-widest transition-colors italic font-bold" :class="selectedMaterials.includes(mat) ? 'text-primary' : 'text-stone-300 group-hover:text-stone-900'">{{ mat }}</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        <!-- Product Grid -->
        <div class="flex-1">
          <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            <div v-for="i in 6" :key="i" class="animate-pulse space-y-6">
              <div class="aspect-[3/4] bg-stone-50 rounded-[3rem]"></div>
              <div class="h-4 bg-stone-50 w-2/3 mx-auto rounded-full"></div>
              <div class="h-4 bg-stone-50 w-1/3 mx-auto rounded-full"></div>
            </div>
          </div>
          
          <div v-else-if="!filteredProducts?.length" class="flex flex-col items-center justify-center py-48 text-center border-2 border-dashed border-stone-50 rounded-[4rem]">
            <span class="material-symbols-outlined text-5xl text-stone-100 mb-8 italic">mystery</span>
            <p class="text-stone-400 font-serif italic text-2xl tracking-tight max-w-sm">This specific silhouette selection has not yet reached our archive.</p>
            <button @click="clearAll" class="mt-10 text-[10px] font-bold uppercase tracking-[0.4em] text-stone-900 border-b border-stone-200 pb-2 hover:border-primary transition-all">Clear Filters</button>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 animate-stagger">
            <NuxtLink
              v-for="(product, idx) in filteredProducts"
              :key="product.id"
              :to="`/products/${product.slug}`"
              class="group block space-y-8"
            >
              <div class="relative aspect-[3/4] bg-stone-50/30 overflow-hidden rounded-[3rem] border border-stone-100 transition-all duration-1000 group-hover:shadow-3xl group-hover:-translate-y-2">
                <img 
                  v-if="product.images?.[0]" 
                  :src="product.images[0]" 
                  :alt="product.name"
                  class="w-full h-full object-contain p-8 transition-all duration-[2s] group-hover:scale-110"
                />
                
                <!-- Refined Badges -->
                <div class="absolute top-8 left-8 flex flex-col gap-3">
                   <span v-if="product.discount" class="bg-primary text-white text-[8px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">
                      Reserve {{ product.discount }}% Relief
                   </span>
                   <span v-if="idx < 3" class="bg-stone-900/10 backdrop-blur-md text-stone-900 text-[8px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-stone-900/5">
                      New Narrative
                   </span>
                </div>
              </div>

              <div class="text-center space-y-3 px-4">
                <p class="text-[9px] text-stone-300 uppercase tracking-[0.5em] font-bold italic">{{ product.category?.name || 'Limited Edition' }}</p>
                <h3 class="text-2xl font-serif font-bold italic text-stone-900 tracking-tight group-hover:text-primary transition-colors">
                   {{ product.name }}
                </h3>
                <div class="flex items-center justify-center gap-4">
                   <p class="text-lg font-body font-bold text-stone-900 tabular-nums">{{ settings?.currency || 'EGP' }} {{ calculatePrice(product).toFixed(0) }}</p>
                </div>
                
                <!-- Color palette indicator -->
                <div v-show="product.colors?.length" class="flex gap-2 justify-center pt-2">
                  <div 
                    v-for="color in product.colors.slice(0, 4)" 
                    :key="color"
                    class="w-2 h-2 rounded-full ring-1 ring-stone-100 shadow-inner"
                    :style="{ backgroundColor: color }"
                  ></div>
                </div>
              </div>
            </NuxtLink>
          </div>
          
          <!-- Pagination -->
          <div v-if="filteredProducts?.length" class="mt-32 pt-16 flex flex-col items-center border-t border-stone-100">
            <button class="h-20 px-20 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-[0.5em] rounded-full hover:bg-primary transition-all duration-700 shadow-2xl shadow-stone-900/10 active:scale-95 italic">
              Explore More Narrative
            </button>
            <div class="flex items-center gap-8 mt-16 font-body text-[10px] tracking-[0.6em] text-stone-300 font-bold uppercase italic">
              <span class="text-stone-900 border-b border-primary pb-2">01</span>
              <span class="hover:text-primary cursor-pointer transition-colors pb-2 border-b border-stone-100">02</span>
              <span class="hover:text-primary cursor-pointer transition-colors pb-2 border-b border-stone-100">03</span>
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
const { getColorName } = useColors()

// Filter states
const searchQuery = ref('')
const selectedSize = ref<string | null>(null)
const selectedColors = ref<string[]>([])
const priceRange = ref([0, 20000])
const sortBy = ref('newest')

// New filter state for Material UI
const selectedMaterials = ref<string[]>([])
const materials = ['Organic Silk', 'Raw Linen', 'Merino Wool']

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
