<template>
  <div class="min-h-screen bg-surface text-on-surface">
    <main class="pt-32 pb-24 px-6 md:px-12 max-w-screen-2xl mx-auto">
      <ClientOnly>
        <template #fallback>
          <div class="animate-pulse">
            <div class="h-8 bg-surface-container rounded mb-12 w-1/3"></div>
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
              <div class="lg:col-span-7 h-[600px] bg-surface-container rounded-lg"></div>
              <div class="lg:col-span-5 space-y-6">
                <div class="h-4 bg-surface-container rounded w-1/4"></div>
                <div class="h-16 bg-surface-container rounded"></div>
                <div class="h-24 bg-surface-container rounded"></div>
                <div class="h-12 bg-surface-container rounded"></div>
                <div class="h-12 bg-surface-container rounded"></div>
              </div>
            </div>
          </div>
        </template>
        <div v-if="pending || !product">
          <div class="animate-pulse">
            <div class="h-8 bg-surface-container rounded mb-12 w-1/3"></div>
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
              <div class="lg:col-span-7 h-[600px] bg-surface-container rounded-lg"></div>
              <div class="lg:col-span-5 space-y-6">
                <div class="h-4 bg-surface-container rounded w-1/4"></div>
                <div class="h-16 bg-surface-container rounded"></div>
                <div class="h-24 bg-surface-container rounded"></div>
                <div class="h-12 bg-surface-container rounded"></div>
                <div class="h-12 bg-surface-container rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="error" class="text-center text-error py-20">Failed to load product</div>
        <div v-else>
          <!-- Breadcrumb -->
          <nav class="mb-12 flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-on-surface-variant font-label">
            <NuxtLink to="/products" class="hover:text-primary transition-colors">Collections</NuxtLink>
            <span class="material-symbols-outlined text-[14px]">chevron_right</span>
            <span class="text-on-surface font-semibold">{{ product.name }}</span>
          </nav>
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            <!-- Image Gallery (Asymmetric Layout) -->
            <div class="lg:col-span-7 grid grid-cols-12 gap-4">
              <!-- Thumbnails Column -->
              <div class="hidden md:flex col-span-2 flex-col gap-4">
                <div v-for="(image, index) in product.images" :key="index" @click="activeImage = image" :class="['aspect-[3/4] rounded-lg overflow-hidden cursor-pointer transition-all bg-surface-container-low flex items-center justify-center p-2', activeImage === image ? 'ring-2 ring-primary ring-offset-2' : 'hover:ring-1 ring-primary/50']">
                  <img :src="image" :alt="product.name" class="w-full h-full object-contain" />
                </div>
              </div>
              <!-- Primary Image -->
              <div class="col-span-12 md:col-span-10 relative group">
                <div class="aspect-[3/4] rounded-lg overflow-hidden bg-surface-container-low shadow-[0_20px_40px_rgba(28,27,27,0.04)] flex items-center justify-center p-6">
                  <img 
                    v-if="activeImage" 
                    :src="activeImage" 
                    :alt="product.name"
                    class="w-full h-full object-contain transform transition-transform duration-700 group-hover:scale-105"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <span class="material-symbols-outlined text-on-surface-variant/30 text-6xl">image</span>
                  </div>
                </div>
                <!-- Editorial Reveal Chip -->
                <div v-if="product.isFeatured" class="absolute bottom-8 right-8 bg-surface/60 backdrop-blur-xl p-4 rounded-xl border border-outline-variant/15 flex items-center gap-3">
                  <span class="text-[10px] font-label uppercase tracking-widest text-on-surface">New Arrival</span>
                  <div class="w-1 h-1 bg-primary rounded-full"></div>
                  <span class="text-[10px] font-label uppercase tracking-widest text-on-surface">Atelier Crafted</span>
                </div>
              </div>
            </div>

            <!-- Product Info -->
            <div class="lg:col-span-5 flex flex-col pt-4">
              <div class="mb-2">
                <span v-if="product.isFeatured" class="text-xs font-label uppercase tracking-[0.2em] text-primary font-semibold">New Arrival</span>
              </div>
              <h1 class="font-serif text-4xl md:text-5xl lg:text-6xl text-on-surface tracking-tight mb-6 italic leading-tight">{{ product.name }}</h1>
              <div class="flex items-baseline gap-4 mb-8">
                <div v-if="product.discount" class="flex flex-col">
                  <span class="text-xs text-stone-400 line-through font-body mb-1">{{ settings?.currency || 'EGP' }} {{ (product.price).toFixed(2) }}</span>
                  <p class="text-2xl font-body text-primary">{{ settings?.currency || 'EGP' }} {{ (product.price * (1 - product.discount/100)).toFixed(2) }}</p>
                </div>
                <p v-else class="text-2xl font-body text-on-surface">{{ settings?.currency || 'EGP' }} {{ (product.price ?? 0).toFixed(2) }}</p>
                <div v-if="product.discount" class="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Save {{ product.discount }}%
                </div>
                <p class="text-xs font-label text-on-surface-variant uppercase tracking-wider ml-auto">Taxes & Duties Included</p>
              </div>

              <div class="mb-10 text-on-surface-variant leading-relaxed font-body text-base max-w-md border-l-2 border-outline-variant/10 pl-6 italic">
                {{ product.description || 'Hand-crafted with premium materials, this piece features exceptional quality and timeless design.' }}
              </div>

              <!-- Selection: Color -->
              <div v-if="product.colors?.length" class="mb-10">
                <div class="flex justify-between items-center mb-4">
                  <span class="text-xs font-label uppercase tracking-widest text-on-surface font-bold">Color — <span class="capitalize">{{ selectedColor }}</span></span>
                </div>
                <div class="flex gap-4">
                  <button 
                    v-for="(color, index) in product.colors" 
                    :key="index"
                    @click="selectedColor = color"
                    :class="['w-8 h-8 rounded-full hover:scale-110 transition-all border border-outline-variant/20', selectedColor === color ? 'ring-2 ring-primary ring-offset-2' : '']"
                    :style="{ backgroundColor: color }"
                    :title="color"
                  ></button>
                </div>
              </div>

              <!-- Selection: Size -->
              <div v-if="product.sizes?.length" class="mb-10">
                <div class="flex justify-between items-center mb-4">
                  <span class="text-xs font-label uppercase tracking-widest text-on-surface font-bold">Select Size</span>
                  <button class="text-[10px] font-label uppercase tracking-widest text-primary underline underline-offset-4 decoration-primary/30">Size Guide</button>
                </div>
                <div class="grid grid-cols-4 gap-2">
                  <button 
                    v-for="size in product.sizes" 
                    :key="size"
                    @click="selectedSize = size"
                    :class="['py-3 border text-xs font-label uppercase tracking-widest transition-colors', selectedSize === size ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm' : 'border-outline-variant/30 hover:bg-surface-container-low text-on-surface-variant']"
                  >
                    {{ size }}
                  </button>
                </div>
              </div>

              <!-- Selection: Quantity -->
              <div class="mb-12">
                <span class="text-xs font-label uppercase tracking-widest text-on-surface font-bold mb-4 block">Quantity</span>
                <div class="flex items-center gap-6">
                  <div class="flex items-center border border-outline-variant/30 rounded-lg overflow-hidden h-14 bg-surface-container-low">
                    <button @click="quantity = Math.max(1, quantity - 1)" class="w-14 h-full hover:bg-surface-container transition-colors border-r border-outline-variant/10 flex items-center justify-center">
                      <span class="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <input type="number" v-model.number="quantity" class="w-12 h-full text-center bg-transparent focus:outline-none font-bold text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    <button @click="quantity++" class="w-14 h-full hover:bg-surface-container transition-colors border-l border-outline-variant/10 flex items-center justify-center">
                      <span class="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                  <div class="flex flex-col">
                    <span v-if="product.stock > 0" class="flex items-center gap-2 text-[10px] text-green-600 font-bold uppercase tracking-widest">
                      <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      In Stock
                    </span>
                    <span v-else class="flex items-center gap-2 text-[10px] text-error font-bold uppercase tracking-widest">
                      <span class="w-1.5 h-1.5 rounded-full bg-error"></span>
                      Out of Stock
                    </span>
                    <span class="text-[9px] text-stone-400 uppercase tracking-widest mt-1">Free 2-Day Shipping</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-col gap-4 mb-16">
                <button 
                  @click="handleAddToCart" 
                  :disabled="product.stock <= 0"
                  class="w-full py-5 bg-gradient-to-tr from-stone-900 to-stone-800 text-white rounded-xl font-label uppercase tracking-[0.2em] text-sm font-bold shadow-xl shadow-stone-950/10 hover:opacity-90 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-4"
                >
                  <span v-if="product.stock > 0" class="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">shopping_bag</span>
                  <span>{{ product.stock > 0 ? 'Add to Bag' : 'Out of Stock' }}</span>
                </button>
                <button class="w-full py-5 border border-outline-variant/30 text-on-surface rounded-xl font-label uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 hover:bg-surface-container-low transition-colors">
                  <span class="material-symbols-outlined text-[20px]">favorite</span>
                  Add to Wishlist
                </button>
              </div>

              <!-- Accordions -->
              <div class="border-t border-outline-variant/20">
                <details class="group py-6 border-b border-outline-variant/20">
                  <summary class="flex justify-between items-center cursor-pointer list-none">
                    <span class="text-xs font-label uppercase tracking-widest text-on-surface font-bold">Size & Fit</span>
                    <span class="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div class="pt-4 text-sm text-on-surface-variant leading-relaxed">
                    Designed for a structured yet relaxed fit. We recommend taking your true size.
                  </div>
                </details>
                <details class="group py-6 border-b border-outline-variant/20">
                  <summary class="flex justify-between items-center cursor-pointer list-none">
                    <span class="text-xs font-label uppercase tracking-widest text-on-surface font-bold">Materials & Care</span>
                    <span class="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div class="pt-4 text-sm text-on-surface-variant leading-relaxed">
                    Premium quality materials. Dry clean only. Produced in our carbon-neutral atelier.
                  </div>
                </details>
                <details class="group py-6 border-b border-outline-variant/20">
                  <summary class="flex justify-between items-center cursor-pointer list-none">
                    <span class="text-xs font-label uppercase tracking-widest text-on-surface font-bold">Shipping & Returns</span>
                    <span class="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div class="pt-4 text-sm text-on-surface-variant leading-relaxed">
                    Complimentary express shipping on all orders. Free returns within 14 days of receipt.
                  </div>
                </details>
              </div>
            </div>
          </div>

          <!-- Recommended Products (Bento/Editorial Grid) -->
          <section class="mt-40">
            <div class="flex items-end justify-between mb-12">
              <div>
                <h2 class="font-serif text-3xl md:text-4xl italic mb-4">You May Also Like</h2>
                <p class="text-on-surface-variant font-body text-sm">Curated selections to complete your look.</p>
              </div>
              <NuxtLink to="/products" class="hidden md:block text-xs font-label uppercase tracking-widest text-primary border-b border-primary/20 pb-1">Shop All Collection</NuxtLink>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <NuxtLink 
                v-for="relatedProduct in relatedProducts" 
                :key="relatedProduct.id"
                :to="`/products/${relatedProduct.slug}`"
                class="group"
                :class="{ 'lg:translate-y-12': relatedProducts.indexOf(relatedProduct) % 2 !== 0 }"
              >
                <div class="aspect-[3/4] mb-6 overflow-hidden rounded-lg bg-surface-container shadow-sm relative">
                  <img 
                    v-if="relatedProduct.images?.[0]"
                    :src="relatedProduct.images[0]" 
                    :alt="relatedProduct.name"
                    class="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <span class="material-symbols-outlined text-on-surface-variant/30">image</span>
                  </div>
                  <div class="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div class="bg-surface/80 backdrop-blur-xl px-3 py-1.5 rounded-full text-[10px] font-label uppercase tracking-wider text-on-surface">Quick View</div>
                  </div>
                </div>
                <h3 class="font-serif text-lg italic mb-2">{{ relatedProduct.name }}</h3>
                <p class="font-body text-sm mt-1 group-hover:text-primary transition-colors">{{ settings?.currency || 'EGP' }} {{ (relatedProduct.price ?? 0).toFixed(2) }}</p>
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
const { isAuthenticated, user } = useAuth()
const { settings } = useSettings()
const { addToCart } = useCart()
const { lastRefreshEvent } = useDataRefresh()
const { toast } = useNotifications()
const slug = route.params.slug

// Product details state
const activeImage = ref('')
const selectedColor = ref('')
const selectedSize = ref('')
const quantity = ref(1)

const handleAddToCart = () => {
  if (!product.value) return
  if (product.value.sizes?.length && !selectedSize.value) {
    toast.warning('Please select a size before adding to bag.', 'Selection Required')
    return
  }
  if (product.value.colors?.length && !selectedColor.value) {
    toast.warning('Please select a color before adding to bag.', 'Selection Required')
    return
  }
  
  const finalPrice = product.value.discount 
    ? product.value.price * (1 - product.value.discount / 100)
    : product.value.price

  addToCart({
    ...product.value,
    price: finalPrice
  }, quantity.value, selectedSize.value, selectedColor.value)
  
  toast.success(`${quantity.value} item(s) added to your shopping bag!`, 'Success')
  navigateTo('/cart')
}

// Fetch product by slug
const { data: product, pending, error, refresh } = await useFetch<any>(`/api/products/${slug}`, {
  default: () => null
})

// Initialize image and defaults when product loads
watch(product, (newProduct) => {
  if (newProduct) {
    if (newProduct.images?.length && !activeImage.value) {
      activeImage.value = newProduct.images[0]
    }
    if (newProduct.colors?.length && !selectedColor.value) {
      selectedColor.value = newProduct.colors[0]
    }
  }
}, { immediate: true })

// Fetch all products for related section
const { data: productsData } = await useFetch<any>('/api/products', {
  default: () => ({ items: [] })
})

// Auto-refresh when admin makes changes (synced across tabs)
watch(() => lastRefreshEvent.value, (event) => {
  if (event?.dataType === 'products') {
    refresh()
  }
})

const relatedProducts = computed(() => {
  if (!product.value || !productsData.value?.items) return []
  return productsData.value.items
    .filter((p: any) => p.id !== product.value.id && p.categoryId === product.value.categoryId)
    .slice(0, 4)
})
</script>

<style scoped>
.editorial-reveal {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
</style>
