<template>
  <div class="min-h-screen bg-surface text-on-surface">
    <!-- TopAppBar -->
    <nav class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(28,27,27,0.04)]">
      <div class="flex justify-between items-center px-12 py-6 w-full max-w-screen-2xl mx-auto">
        <NuxtLink to="/" class="text-2xl font-serif italic text-stone-900 tracking-tight">VIGO</NuxtLink>
        <div class="hidden md:flex items-center gap-10 font-serif tracking-tight">
          <NuxtLink to="/products" class="text-stone-600 hover:text-stone-900 transition-colors">Collections</NuxtLink>
          <a class="text-stone-600 hover:text-stone-900 transition-colors">New Arrivals</a>
          <a class="text-stone-600 hover:text-stone-900 transition-colors">Lookbook</a>
          <a class="text-stone-600 hover:text-stone-900 transition-colors">Our Story</a>
        </div>
        <div class="flex items-center gap-6">
          <NuxtLink v-if="!isAuthenticated" to="/auth/login" class="hover:opacity-80 transition-all duration-300">
            <span class="material-symbols-outlined">person</span>
          </NuxtLink>
          <NuxtLink v-else to="/admin" class="hover:opacity-80 transition-all duration-300">
            <span class="material-symbols-outlined">dashboard</span>
          </NuxtLink>
          <button class="hover:opacity-80 transition-all duration-300 relative">
            <span class="material-symbols-outlined">shopping_bag</span>
            <span class="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
          </button>
        </div>
      </div>
    </nav>

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
                <div v-for="(image, index) in product.images" :key="index" class="aspect-[3/4] rounded-lg overflow-hidden cursor-pointer hover:ring-1 ring-primary transition-all">
                  <img :src="image" :alt="product.name" class="w-full h-full object-cover" />
                </div>
              </div>
              <!-- Primary Image -->
              <div class="col-span-12 md:col-span-10 relative group">
                <div class="aspect-[3/4] rounded-lg overflow-hidden bg-surface-container-low shadow-[0_20px_40px_rgba(28,27,27,0.04)]">
                  <img 
                    v-if="product.images?.[0]" 
                    :src="product.images[0]" 
                    :alt="product.name"
                    class="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
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
                <p class="text-2xl font-body text-on-surface">${{ (product.price ?? 0).toFixed(2) }}</p>
                <p class="text-sm font-label text-on-surface-variant uppercase tracking-wider">Taxes & Duties Included</p>
              </div>
              <div class="mb-10 text-on-surface-variant leading-relaxed font-body text-base max-w-md">
                {{ product.description || 'Hand-crafted with premium materials, this piece features exceptional quality and timeless design.' }}
              </div>

              <!-- Selection: Color -->
              <div v-if="product.colors?.length" class="mb-10">
                <div class="flex justify-between items-center mb-4">
                  <span class="text-xs font-label uppercase tracking-widest text-on-surface font-bold">Color — {{ product.colors[0] }}</span>
                </div>
                <div class="flex gap-4">
                  <button 
                    v-for="(color, index) in product.colors" 
                    :key="index"
                    class="w-8 h-8 rounded-full hover:scale-110 transition-all"
                    :style="{ backgroundColor: color }"
                  ></button>
                </div>
              </div>

              <!-- Selection: Size -->
              <div v-if="product.sizes?.length" class="mb-12">
                <div class="flex justify-between items-center mb-4">
                  <span class="text-xs font-label uppercase tracking-widest text-on-surface font-bold">Select Size</span>
                  <button class="text-[10px] font-label uppercase tracking-widest text-primary underline underline-offset-4 decoration-primary/30">Size Guide</button>
                </div>
                <div class="grid grid-cols-4 gap-2">
                  <button 
                    v-for="size in product.sizes" 
                    :key="size"
                    class="py-3 border border-outline-variant/30 text-xs font-label uppercase tracking-widest hover:bg-surface-container-low transition-colors"
                  >
                    {{ size }}
                  </button>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-col gap-4 mb-16">
                <button class="w-full py-5 bg-gradient-to-tr from-primary to-primary-container text-on-primary rounded-xl font-label uppercase tracking-[0.2em] text-sm font-bold shadow-lg shadow-primary/10 hover:opacity-90 transition-all transform active:scale-[0.98]">
                  Add to Bag
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
                <p class="text-on-surface-variant font-body text-sm">${{ (relatedProduct.price ?? 0).toFixed(2) }}</p>
              </NuxtLink>
            </div>
          </section>
        </div>
      </ClientOnly>
    </main>

    <!-- Footer -->
    <footer class="bg-stone-100 w-full pt-20 pb-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 max-w-screen-2xl mx-auto">
        <div class="col-span-1">
          <span class="font-serif text-xl mb-4 block text-stone-900">VIGO</span>
          <p class="text-stone-500 font-body text-sm leading-relaxed tracking-wide">Defining the new era of artisanal luxury through sustainable craft and timeless silhouettes.</p>
        </div>
        <div class="col-span-1">
          <h4 class="text-stone-900 font-semibold mb-6 font-body text-sm">Shop</h4>
          <ul class="space-y-4">
            <li><NuxtLink to="/products" class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 text-sm font-body transition-all">Collections</NuxtLink></li>
            <li><a class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 text-sm font-body transition-all">New Arrivals</a></li>
            <li><a class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 text-sm font-body transition-all">Our Story</a></li>
          </ul>
        </div>
        <div class="col-span-1">
          <h4 class="text-stone-900 font-semibold mb-6 font-body text-sm">Customer Care</h4>
          <ul class="space-y-4">
            <li><a class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 text-sm font-body transition-all">Shipping & Returns</a></li>
            <li><a class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 text-sm font-body transition-all">Privacy Policy</a></li>
            <li><a class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 text-sm font-body transition-all">Contact Us</a></li>
          </ul>
        </div>
        <div class="col-span-1">
          <h4 class="text-stone-900 font-semibold mb-6 font-body text-sm">Join the Atelier</h4>
          <p class="text-stone-500 text-sm mb-4 font-body">Receive exclusive updates on our latest collections.</p>
          <div class="relative">
            <input class="w-full bg-transparent border-b border-outline-variant/30 py-2 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="Your Email" type="email"/>
            <button class="absolute right-0 top-1/2 -translate-y-1/2 text-primary font-bold text-xs uppercase tracking-widest">Join</button>
          </div>
        </div>
      </div>
      <div class="mt-20 px-12 max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 border-t border-stone-200 pt-10">
        <p class="text-stone-500 font-body text-sm tracking-wide">© 2024 VIGO ATELIER. ALL RIGHTS RESERVED.</p>
        <div class="flex gap-8">
          <a class="text-stone-500 text-sm font-body hover:text-primary transition-colors">Instagram</a>
          <a class="text-stone-500 text-sm font-body hover:text-primary transition-colors">Pinterest</a>
          <a class="text-stone-500 text-sm font-body hover:text-primary transition-colors">Threads</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { isAuthenticated } = useAuth()
const { lastRefreshEvent } = useDataRefresh()
const slug = route.params.slug

// Fetch product by slug
const { data: product, pending, error, refresh } = await useFetch<any>(`/api/products/${slug}`, {
  default: () => null
})

// Fetch all products for related section
const { data: productsData } = await useFetch<any>('/api/products', {
  default: () => ({ items: [] })
})

// Auto-refresh when admin makes changes (synced across tabs)
watch(lastRefreshEvent, (event) => {
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
