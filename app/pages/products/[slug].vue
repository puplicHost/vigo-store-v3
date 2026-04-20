<template>
  <div class="min-h-screen bg-stone-50 text-stone-900 selection:bg-primary/20">
    <main class="pt-32 pb-24 px-8 md:px-16 max-w-screen-2xl mx-auto">
      <ClientOnly>
        <!-- Skeleton / Loading -->
        <template #fallback>
          <div class="animate-pulse flex flex-col lg:flex-row gap-20">
            <div class="lg:w-2/3 aspect-[3/4] bg-stone-100 rounded-3xl"></div>
            <div class="lg:w-1/3 space-y-8 py-10">
              <div class="h-4 bg-stone-100 w-24"></div>
              <div class="h-16 bg-stone-100 w-full"></div>
              <div class="h-24 bg-stone-100 w-full"></div>
            </div>
          </div>
        </template>

        <div v-if="pending || !product" class="flex flex-col items-center justify-center py-40">
           <span class="material-symbols-outlined text-4xl animate-spin text-primary/20">loading</span>
        </div>
        <div v-else-if="error" class="text-center py-40 border border-dashed border-red-100 rounded-3xl">
           <p class="text-red-400 font-serif italic text-lg tracking-tight">The piece you are looking for has been archived or moved.</p>
           <NuxtLink to="/products" class="mt-8 inline-block text-[10px] uppercase font-bold tracking-[0.3em] text-stone-900 border-b border-stone-900">Return to Collection</NuxtLink>
        </div>

        <div v-else>
          <!-- Breadcrumb Narrative -->
          <nav class="mb-16 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold">
            <NuxtLink to="/products" class="hover:text-stone-900 transition-colors italic">Collections</NuxtLink>
            <span class="w-1 h-1 rounded-full bg-stone-200"></span>
            <span class="text-stone-900 italic font-medium">{{ product.name }}</span>
          </nav>

          <div class="flex flex-col lg:flex-row gap-20 xl:gap-32">
            <!-- Image Theater (Left Column) -->
            <div class="lg:w-7/12 xl:w-8/12 flex flex-col gap-6">
              <!-- Main Image Viewer -->
              <div class="relative aspect-[3/4] overflow-hidden rounded-3xl bg-white border border-stone-100 shadow-sm transition-all duration-700 group">
                <img 
                  v-if="product.images?.length"
                  :src="product.images[selectedImageIndex] || product.images[0]" 
                  :alt="`${product.name} - Main View`"
                  class="w-full h-full object-contain p-8 md:p-12 transition-transform duration-1000 group-hover:scale-105"
                />
                
                <!-- Floating Badge -->
                <div v-if="product.isFeatured" class="absolute top-8 left-8 z-10">
                  <span class="bg-black text-white text-[9px] font-bold uppercase tracking-[0.3em] px-4 py-2 rounded-sm shadow-2xl">Atelier Preview</span>
                </div>
              </div>

              <!-- Thumbnails -->
              <div v-if="product.images?.length > 1" class="flex gap-4 overflow-x-auto pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <button 
                  v-for="(image, index) in product.images" 
                  :key="index"
                  @click="selectedImageIndex = index"
                  class="relative flex-none w-24 sm:w-28 aspect-[3/4] overflow-hidden rounded-2xl bg-white border-[1.5px] transition-all duration-300 snap-start"
                  :class="selectedImageIndex === index ? 'border-primary shadow-md' : 'border-stone-100 hover:border-stone-300 opacity-60 hover:opacity-100'"
                >
                  <img 
                    :src="image" 
                    :alt="`Thumbnail ${index + 1}`"
                    class="w-full h-full object-contain p-3"
                  />
                </button>
              </div>
            </div>

            <!-- Product Intelligence (Right Column - Sticky) -->
            <aside class="lg:w-5/12 xl:w-4/12 flex flex-col pt-4">
              <div class="sticky top-40">
                <!-- Title & Brand -->
                <div class="space-y-4 mb-12">
                   <span class="text-[9px] uppercase tracking-[0.4em] text-primary font-bold block mb-4">VIGO BESPOKE SELECTION</span>
                   <h1 class="text-5xl md:text-6xl xl:text-7xl font-serif font-bold tracking-tight text-stone-900 leading-[1.1] italic">
                     {{ product.name }}
                   </h1>
                   <div class="flex items-center gap-6 pt-4">
                      <div class="flex flex-col">
                        <div v-if="product.discount" class="flex items-center gap-3">
                           <span class="text-stone-300 text-sm line-through tabular-nums">{{ settings?.currency || 'EGP' }} {{ product.price.toFixed(0) }}</span>
                           <span class="text-primary text-[10px] font-bold uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-sm">Save {{ product.discount }}%</span>
                        </div>
                        <p class="text-4xl font-body font-bold text-stone-900 tracking-tighter tabular-nums mt-1">
                          {{ settings?.currency || 'EGP' }} {{ calculatePrice(product).toFixed(0) }}
                        </p>
                      </div>
                      <div class="h-10 w-px bg-stone-100 ml-auto hidden md:block"></div>
                      <p class="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400 max-w-[100px] leading-relaxed hidden md:block">Complimentary Express Shipping</p>
                   </div>
                </div>

                <!-- Abstract / Narrative -->
                <div class="mb-16">
                  <p class="text-stone-500 font-body text-base leading-relaxed italic border-l-2 border-primary/20 pl-6 lg:max-w-md">
                    {{ product.description || 'A masterpiece of contemporary tailoring, blending sculptural silhouettes with premium textile innovation.' }}
                  </p>
                </div>

                <!-- Variant Control: Color -->
                <div v-if="product.colors?.length" class="mb-14">
                  <div class="flex justify-between items-center mb-6">
                    <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Tonal Palette</span>
                    <span class="text-[10px] text-stone-900 font-bold uppercase tracking-widest">{{ getColorName(selectedColor) }}</span>
                  </div>
                  <div class="flex gap-5">
                    <button 
                      v-for="color in product.colors" 
                      :key="color"
                      @click="selectedColor = color"
                      class="group relative"
                    >
                      <div 
                        class="w-10 h-10 rounded-full border-2 transition-all p-1"
                        :class="selectedColor === color ? 'border-primary scale-110' : 'border-transparent hover:border-stone-200'"
                      >
                        <div class="w-full h-full rounded-full shadow-inner" :style="{ backgroundColor: color }"></div>
                      </div>
                    </button>
                  </div>
                </div>

                <!-- Variant Control: Size -->
                <div v-if="product.sizes?.length" class="mb-14">
                  <div class="flex justify-between items-center mb-6">
                    <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Proportion</span>
                    <button class="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-900 border-b border-stone-200">Size Intelligence</button>
                  </div>
                  <div class="grid grid-cols-4 gap-3">
                    <button 
                      v-for="size in product.sizes" 
                      :key="size"
                      @click="selectedSize = size"
                      :class="[
                        'h-12 border text-[10px] font-bold uppercase tracking-widest transition-all rounded-md flex items-center justify-center',
                        selectedSize === size 
                          ? 'border-stone-900 bg-stone-900 text-white shadow-xl shadow-black/10' 
                          : 'border-stone-100 bg-white text-stone-400 hover:border-stone-300'
                      ]"
                    >
                      {{ size }}
                    </button>
                  </div>
                </div>

                <!-- Commitment Action -->
                <div class="flex flex-col gap-6 mb-20">
                  <div class="flex items-center gap-6">
                    <div class="flex items-center bg-white border border-stone-100 rounded-full h-16 p-2 shadow-sm">
                      <button @click="quantity = Math.max(1, quantity - 1)" class="w-12 h-12 rounded-full hover:bg-stone-50 transition-colors flex items-center justify-center text-stone-400">
                        <span class="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <input type="number" v-model.number="quantity" class="w-12 text-center bg-transparent focus:outline-none font-bold text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      <button @click="quantity++" class="w-12 h-12 rounded-full hover:bg-stone-50 transition-colors flex items-center justify-center text-stone-400">
                        <span class="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                    
                    <button 
                      @click="handleAddToCart" 
                      :disabled="product.stock <= 0"
                      class="flex-1 h-16 bg-stone-900 text-white rounded-full font-label uppercase tracking-[0.4em] text-[11px] font-bold shadow-2xl shadow-stone-900/10 hover:bg-primary transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-4"
                    >
                      <span>{{ product.stock > 0 ? 'Reserve Piece' : 'Out of Stock' }}</span>
                      <span class="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                  </div>

                  <button class="w-full py-4 border border-stone-100 text-stone-400 rounded-full text-[10px] uppercase font-bold tracking-[0.3em] flex items-center justify-center gap-3 hover:text-stone-900 hover:border-stone-300 transition-all">
                    <span class="material-symbols-outlined text-sm">favorite</span>
                    Archive to Wishlist
                  </button>
                </div>

                <!-- Intellectual Details Accordions -->
                <article class="border-t border-stone-100 divide-y divide-stone-100">
                  <details v-for="(detail, i) in detailsMap" :key="i" class="group py-6">
                    <summary class="flex justify-between items-center cursor-pointer list-none">
                      <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-900 italic font-serif">{{ detail.label }}</span>
                      <span class="material-symbols-outlined text-stone-300 group-open:rotate-180 transition-transform">expand_more</span>
                    </summary>
                    <div class="pt-6 text-sm text-stone-500 font-body leading-relaxed max-w-sm italic">
                      {{ detail.content }}
                    </div>
                  </details>
                </article>
              </div>
            </aside>
          </div>

          <!-- Editorial Recommendations -->
          <section class="mt-48 pt-32 border-t border-stone-100">
            <header class="flex items-end justify-between mb-20">
              <div class="space-y-4">
                <span class="text-[9px] uppercase tracking-[0.4em] text-primary font-bold block">EDITORIAL SELECTION</span>
                <h2 class="text-4xl md:text-6xl font-serif font-bold tracking-tight text-stone-900 italic">Complete the Silhouette</h2>
              </div>
              <NuxtLink to="/products" class="hidden md:block text-[10px] font-bold uppercase tracking-[0.4em] text-stone-900 border-b border-stone-900/10 pb-1 hover:border-stone-900 transition-all">All Collections</NuxtLink>
            </header>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-24">
              <NuxtLink 
                v-for="related in relatedProducts" 
                :key="related.id"
                :to="`/products/${related.slug}`"
                class="group block"
              >
                <div class="relative aspect-[3/4] mb-8 overflow-hidden rounded-2xl bg-white border border-stone-100 group-hover:shadow-3xl transition-all duration-700">
                  <img 
                    v-if="related.images?.[0]"
                    :src="related.images[0]" 
                    :alt="related.name"
                    class="w-full h-full object-contain p-6 transition-transform duration-[2s] group-hover:scale-110"
                  />
                  <div class="absolute inset-0 bg-stone-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 class="font-serif text-xl font-bold italic text-stone-900 mb-3 group-hover:text-primary transition-colors">{{ related.name }}</h3>
                <p class="font-body text-sm font-bold text-stone-400 tracking-tighter tabular-nums">{{ settings?.currency || 'EGP' }} {{ (related.price ?? 0).toFixed(0) }}</p>
              </NuxtLink>
            </div>
          </section>
        </div>
      </ClientOnly>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { settings } = useSettings()
const { addToCart } = useCart()
const { toast } = useNotifications()
const { getColorName } = useColors()
const slug = route.params.slug

// Core Details Map
const detailsMap = [
  { label: 'Artisan Fit', content: 'Engineered for a refined silhouette. Our signature tailoring ensures a sculptural fit that breathes with the body. Please consult our size intel for precise proportions.' },
  { label: 'Textile Narrative', content: 'Sourced from archival mills, this piece utilizes premium sustainably-certified textiles designed for longevity and sensory comfort.' },
  { label: 'Legacy Service', content: 'Complimentary white-glove express delivery. We accept returns within 14 cycles of reception, honoring the permanence of your purchase.' }
]

// Interactive States
const selectedColor = ref('')
const selectedSize = ref('')
const quantity = ref(1)
const selectedImageIndex = ref(0)

// Price Calculation
const calculatePrice = (product: any) => {
  if (!product) return 0
  if (product.discount) return product.price * (1 - product.discount / 100)
  return product.price
}

// Fetch Main Product
const { data: product, pending, error } = await useApiFetch<any>(`/api/products/${slug}`)

// Related Products (Editorial Selection)
const { data: relatedData } = await useApiFetch<any[]>('/api/products', {
  query: computed(() => ({
    limit: 5,
    categoryId: product.value?.categoryId
  }))
})

const relatedProducts = computed(() => {
  if (!product.value || !relatedData.value) return []
  return relatedData.value.filter((p: any) => p.id !== product.value.id).slice(0, 4)
})

// Lifecycle defaults
watch(product, (newP) => {
  if (newP) {
    if (newP.colors?.length && !selectedColor.value) selectedColor.value = newP.colors[0]
    selectedImageIndex.value = 0
  }
}, { immediate: true })

const handleAddToCart = () => {
  if (!product.value) return
  if (product.value.sizes?.length && !selectedSize.value) {
    toast.warning('Please select a proportion before reservation.', 'Intel Required')
    return
  }
  
  const finalPrice = calculatePrice(product.value)
  addToCart({ ...product.value, price: finalPrice }, quantity.value, selectedSize.value, selectedColor.value)
  
  toast.success('Your selection has been added to the bag.', 'Atelier Updated')
  navigateTo('/cart')
}
</script>

<style scoped>
/* Hidden scrollbar but keeps functionality */
[appearance="textfield"]::-webkit-outer-spin-button,
[appearance="textfield"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
