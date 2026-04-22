<template>
  <div class="min-h-screen bg-white text-on-surface selection:bg-primary/10">
    <main class="pt-32 pb-24 px-6 md:px-12 max-w-screen-2xl mx-auto">
      <ClientOnly>
        <!-- Skeleton / Loading -->
        <template #fallback>
          <div class="animate-pulse flex flex-col lg:flex-row gap-20">
            <div class="lg:w-2/3 aspect-[3/4] bg-stone-50 rounded-2xl"></div>
            <div class="lg:w-1/3 space-y-12 py-10">
              <div class="h-4 bg-stone-50 w-24"></div>
              <div class="h-20 bg-stone-50 w-full"></div>
              <div class="h-32 bg-stone-50 w-full"></div>
            </div>
          </div>
        </template>

        <div v-if="pending || !product" class="flex flex-col items-center justify-center py-40">
           <span class="material-symbols-outlined text-4xl animate-spin text-stone-100 italic">progress_activity</span>
        </div>
        <div v-else-if="error" class="text-center py-40 bg-stone-50/50 rounded-[3rem] border border-stone-100">
           <p class="text-stone-400 font-serif italic text-2xl tracking-tight">The piece you are looking for has been archived.</p>
           <NuxtLink to="/products" class="mt-10 inline-block text-[10px] uppercase font-bold tracking-[0.4em] text-stone-900 border-b border-stone-200 pb-2 hover:border-primary transition-all">Return to Collections</NuxtLink>
        </div>

        <div v-else class="animate-stagger">
          <div class="flex flex-col lg:flex-row gap-20 xl:gap-32">
            <!-- Image Theater (Left Column) -->
            <div class="lg:w-7/12 xl:w-8/12 flex flex-col gap-8">
              <!-- Main Image Viewer -->
              <div class="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-stone-50/50 border border-stone-100 group">
                <Transition name="fade" mode="out-in">
                  <img 
                    :key="selectedImageIndex"
                    v-if="product.images?.length"
                    :src="product.images[selectedImageIndex] || product.images[0]" 
                    :alt="`${product.name} - View ${selectedImageIndex + 1}`"
                    class="w-full h-full object-contain p-12 md:p-20 transition-all duration-[2s] group-hover:scale-105"
                  />
                </Transition>
                
                <!-- Floating Badge -->
                <div v-if="product.isFeatured" class="absolute top-10 left-10 z-10">
                  <span class="bg-primary text-white text-[9px] font-bold uppercase tracking-[0.4em] px-5 py-2.5 rounded-full shadow-2xl shadow-primary/20">Atelier Exclusive</span>
                </div>
              </div>

              <!-- Thumbnails Grid -->
              <div v-if="product.images?.length > 1" class="grid grid-cols-4 md:grid-cols-6 gap-4">
                <button 
                  v-for="(image, index) in product.images" 
                  :key="index"
                  @click="selectedImageIndex = index"
                  class="relative aspect-[3/4] overflow-hidden rounded-xl bg-stone-50/30 border transition-all duration-500"
                  :class="selectedImageIndex === index ? 'border-primary ring-4 ring-primary/5 shadow-lg' : 'border-stone-100 hover:border-stone-200 opacity-60 hover:opacity-100'"
                >
                  <img 
                    :src="image" 
                    :alt="`Thumbnail ${index + 1}`"
                    class="w-full h-full object-contain p-2"
                  />
                </button>
              </div>
            </div>

            <!-- Product Narrative (Right Column - Sticky) -->
            <aside class="lg:w-5/12 xl:w-4/12 flex flex-col">
              <div class="sticky top-40 space-y-16">
                <!-- Header -->
                <div class="space-y-8">
                   <div class="flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-stone-300 font-bold">
                     <NuxtLink to="/products" class="hover:text-primary transition-colors italic">Collections</NuxtLink>
                     <span class="w-1 h-1 rounded-full bg-stone-100"></span>
                     <span class="text-stone-400 italic">{{ product.category?.name || 'Limited Edition' }}</span>
                   </div>
                   
                   <h1 class="text-5xl md:text-7xl font-serif font-bold tracking-tight text-stone-900 leading-[1] italic">
                     {{ product.name }}
                   </h1>

                   <div class="space-y-2">
                     <div v-if="product.discount" class="flex items-center gap-4">
                        <span class="text-stone-300 text-lg line-through tabular-nums italic font-serif">{{ settings?.currency || 'EGP' }} {{ product.price.toFixed(0) }}</span>
                        <span class="text-primary text-[9px] font-bold uppercase tracking-[0.2em] bg-primary/5 px-3 py-1 rounded-full">Reserve {{ product.discount }}% Relief</span>
                     </div>
                     <p class="text-4xl md:text-5xl font-body font-bold text-stone-900 tracking-tighter tabular-nums">
                       {{ settings?.currency || 'EGP' }} {{ calculatePrice(product).toFixed(0) }}
                     </p>
                   </div>
                </div>

                <!-- Abstract -->
                <div class="space-y-6">
                  <span class="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 block italic">The Silhouette Narrative</span>
                  <p class="text-stone-500 font-body text-base leading-relaxed italic max-w-sm">
                    {{ product.description || 'A masterpiece of contemporary tailoring, blending sculptural silhouettes with premium textile innovation. Designed to be worn as an extension of one\'s creative identity.' }}
                  </p>
                </div>

                <!-- Selections -->
                <div class="space-y-14">
                  <!-- Color Selection -->
                  <div v-if="product.colors?.length" class="space-y-6">
                    <div class="flex justify-between items-center">
                      <span class="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 italic">Selection</span>
                      <span class="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">{{ getColorName(selectedColor) }}</span>
                    </div>
                    <div class="flex flex-wrap gap-4">
                      <button 
                        v-for="color in product.colors" 
                        :key="color"
                        @click="selectedColor = color"
                        class="group"
                      >
                        <div 
                          class="w-12 h-12 rounded-full border border-stone-100 flex items-center justify-center transition-all duration-500"
                          :class="selectedColor === color ? 'border-primary ring-4 ring-primary/5 scale-110 shadow-lg' : 'hover:border-stone-300'"
                        >
                          <div class="w-9 h-9 rounded-full shadow-inner" :style="{ backgroundColor: color }"></div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <!-- Size Selection -->
                  <div v-if="product.sizes?.length" class="space-y-6">
                    <div class="flex justify-between items-center">
                      <span class="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 italic">Proportion</span>
                      <button class="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-300 border-b border-stone-100 hover:text-primary hover:border-primary transition-all">Size Intel</button>
                    </div>
                    <div class="grid grid-cols-4 gap-3">
                      <button 
                        v-for="size in product.sizes" 
                        :key="size"
                        @click="selectedSize = size"
                        :class="[
                          'h-14 border text-[11px] font-bold uppercase tracking-widest transition-all duration-500 rounded-2xl flex items-center justify-center',
                          selectedSize === size 
                            ? 'border-primary bg-primary text-white shadow-2xl shadow-primary/20' 
                            : 'border-stone-100 bg-stone-50/30 text-stone-400 hover:border-stone-300'
                        ]"
                      >
                        {{ size }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="space-y-8">
                  <div class="flex gap-6 items-center">
                    <div class="flex items-center bg-stone-50/50 border border-stone-100 rounded-full h-16 p-2">
                      <button @click="quantity = Math.max(1, quantity - 1)" class="w-12 h-12 text-stone-300 hover:text-primary transition-colors"><span class="material-symbols-outlined text-sm">remove</span></button>
                      <input type="number" v-model.number="quantity" class="w-10 text-center bg-transparent focus:outline-none font-bold text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-stone-900" />
                      <button @click="quantity++" class="w-12 h-12 text-stone-300 hover:text-primary transition-colors"><span class="material-symbols-outlined text-sm">add</span></button>
                    </div>
                    
                    <button 
                      type="button"
                      @click.stop.prevent="handleAddToCart" 
                      :disabled="product.stock <= 0 || isAddingToCart"
                      class="flex-1 h-16 bg-stone-900 text-white rounded-full font-label uppercase tracking-[0.4em] text-[11px] font-bold shadow-2xl hover:bg-primary transition-all duration-700 disabled:opacity-30 flex items-center justify-center gap-3 active:scale-95"
                    >
                      <span v-if="isAddingToCart" class="material-symbols-outlined text-lg animate-spin">refresh</span>
                      <span v-else>{{ product.stock > 0 ? 'Reserve Piece' : 'Archived' }}</span>
                      <span v-if="!isAddingToCart" class="material-symbols-outlined text-lg italic">arrow_forward_ios</span>
                    </button>
                  </div>

                  <div class="flex gap-4">
                     <button class="flex-1 py-5 border border-stone-100 text-stone-400 rounded-full text-[10px] uppercase font-bold tracking-[0.3em] flex items-center justify-center gap-3 hover:text-primary hover:border-primary/20 transition-all active:scale-95">
                        <span class="material-symbols-outlined text-lg italic">favorite</span>
                        Archive to Wishlist
                     </button>
                     <button class="w-16 h-16 border border-stone-100 text-stone-300 rounded-full flex items-center justify-center hover:text-primary transition-all">
                        <span class="material-symbols-outlined text-xl italic">share</span>
                     </button>
                  </div>
                </div>

                <!-- Intel Accordions -->
                <div class="border-t border-stone-100 pt-8 divide-y divide-stone-50">
                   <details v-for="(detail, i) in detailsMap" :key="i" class="group">
                     <summary class="flex justify-between items-center py-6 cursor-pointer list-none">
                       <span class="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-900 italic font-serif group-hover:text-primary transition-colors">{{ detail.label }}</span>
                       <span class="material-symbols-outlined text-stone-200 group-open:rotate-180 transition-transform">expand_more</span>
                     </summary>
                     <div class="pb-8 text-sm text-stone-400 font-body leading-relaxed italic pr-10">
                       {{ detail.content }}
                     </div>
                   </details>
                </div>
              </div>
            </aside>
          </div>

          <!-- Editorial Selection -->
          <section class="mt-48 space-y-24">
             <div class="text-center space-y-6">
                <span class="text-[10px] uppercase tracking-[0.6em] text-stone-300 font-bold block">Artisanal Narrative</span>
                <h2 class="text-4xl md:text-6xl font-serif italic tracking-tight text-on-surface">Complete the Silhouette</h2>
             </div>
             
             <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                <NuxtLink v-for="related in relatedProducts" :key="related.id" :to="`/products/${related.slug}`" class="group block space-y-8 animate-stagger">
                  <div class="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-stone-50/50 border border-stone-100 group-hover:shadow-3xl transition-all duration-1000">
                    <img :src="related.images?.[0]" :alt="related.name" class="w-full h-full object-contain p-8 transition-all duration-[2s] group-hover:scale-110"/>
                  </div>
                  <div class="text-center space-y-2">
                    <h3 class="font-serif text-2xl font-bold italic text-stone-900 group-hover:text-primary transition-colors">{{ related.name }}</h3>
                    <p class="font-body text-sm font-bold text-stone-400 tracking-tighter tabular-nums">{{ settings?.currency || 'EGP' }} {{ related.price.toFixed(0) }}</p>
                  </div>
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

const isAddingToCart = ref(false)

const handleAddToCart = async () => {
  if (!product.value) return
  if (isAddingToCart.value) return
  if (product.value.sizes?.length && !selectedSize.value) {
    toast.warning('Please select a proportion before reservation.', 'Intel Required')
    return
  }
  
  isAddingToCart.value = true
  
  try {
    const finalPrice = calculatePrice(product.value)
    addToCart({ ...product.value, price: finalPrice }, quantity.value, selectedSize.value, selectedColor.value)
    
    toast.success('Your selection has been added to the bag.', 'Atelier Updated')
  } finally {
    isAddingToCart.value = false
  }
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
