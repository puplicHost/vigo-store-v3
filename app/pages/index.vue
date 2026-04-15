<template>
  <div class="min-h-screen bg-surface text-on-surface">
    <!-- TopNavBar -->
    <nav class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(28,27,27,0.04)]">
      <div class="flex justify-between items-center px-12 py-6 w-full max-w-screen-2xl mx-auto">
        <NuxtLink to="/" class="text-2xl font-serif italic text-stone-900 tracking-tight">VIGO</NuxtLink>
        <div class="hidden md:flex items-center gap-10">
          <NuxtLink to="/products" class="text-primary border-b border-primary/30 pb-1 font-serif tracking-tight">Collections</NuxtLink>
          <a class="text-stone-600 hover:text-stone-900 transition-colors font-serif tracking-tight">New Arrivals</a>
          <a class="text-stone-600 hover:text-stone-900 transition-colors font-serif tracking-tight">Lookbook</a>
          <a class="text-stone-600 hover:text-stone-900 transition-colors font-serif tracking-tight">Our Story</a>
        </div>
        <div class="flex items-center gap-6">
          <NuxtLink v-if="!isAuthenticated" to="/auth/login" class="hover:opacity-80 transition-all duration-300 text-primary">
            <span class="material-symbols-outlined">person</span>
          </NuxtLink>
          <NuxtLink v-else to="/admin" class="hover:opacity-80 transition-all duration-300 text-primary">
            <span class="material-symbols-outlined">dashboard</span>
          </NuxtLink>
          <button class="hover:opacity-80 transition-all duration-300 text-primary">
            <span class="material-symbols-outlined">shopping_bag</span>
          </button>
        </div>
      </div>
    </nav>

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

      <!-- Featured Collections (Asymmetric Grid) -->
      <section class="py-32 px-12 max-w-screen-2xl mx-auto">
        <div class="grid grid-cols-12 gap-8 items-end">
          <div class="col-span-12 md:col-span-7 mb-12">
            <div class="relative group cursor-pointer overflow-hidden rounded-xl">
              <img 
                alt="Winter Collection" 
                class="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80"
              />
              <div class="absolute bottom-8 left-8">
                <span class="label-md uppercase tracking-[0.2em] text-white/90 text-xs mb-2 block">Curation 01</span>
                <h3 class="text-4xl text-white font-serif">The Winter Collection</h3>
              </div>
            </div>
          </div>
          <div class="col-span-12 md:col-span-5 flex flex-col gap-8">
            <div class="relative group cursor-pointer overflow-hidden rounded-xl">
              <img 
                alt="Accessories" 
                class="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80"
              />
              <div class="absolute bottom-8 left-8">
                <span class="label-md uppercase tracking-[0.2em] text-white/90 text-xs mb-2 block">Leather Goods</span>
                <h3 class="text-3xl text-white font-serif">Essential Accessories</h3>
              </div>
            </div>
            <div class="bg-surface-container-low p-12 rounded-xl h-full flex flex-col justify-center">
              <h2 class="text-3xl font-serif mb-6">Designed to endure.</h2>
              <p class="font-body text-on-surface-variant leading-relaxed">
                Our philosophy centers on the longevity of style. Each piece is a testament to the atelier's commitment to quality over trend.
              </p>
              <a class="mt-8 text-primary font-semibold underline underline-offset-8 decoration-1 decoration-primary/30 hover:decoration-primary transition-all">Discover Our Process</a>
            </div>
          </div>
        </div>
      </section>

      <!-- New Arrivals (Product Grid) -->
      <section class="py-24 bg-surface-container-low">
        <div class="max-w-screen-2xl mx-auto px-12">
          <div class="flex justify-between items-end mb-16">
            <div>
              <span class="uppercase tracking-[0.2em] text-xs font-label text-primary font-bold">Latest Releases</span>
              <h2 class="text-5xl font-serif mt-4">New Arrivals</h2>
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
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center bg-surface-container">
                      <span class="material-symbols-outlined text-on-surface-variant/30">image</span>
                    </div>
                    <div v-if="product.isFeatured" class="absolute top-4 right-4 bg-white/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold">New</div>
                  </div>
                  <h4 class="font-body text-base font-medium">{{ product.name }}</h4>
                  <p class="font-body text-sm text-on-surface-variant mt-1">${{ (product.price ?? 0).toFixed(2) }}</p>
                </NuxtLink>
              </div>
            </div>
          </ClientOnly>
        </div>
      </section>

      <!-- Brand Story (Editorial Layout) -->
      <section class="py-32 px-12 max-w-screen-2xl mx-auto overflow-hidden">
        <div class="flex flex-col md:flex-row items-center gap-20">
          <div class="w-full md:w-1/2 relative">
            <div class="absolute -top-10 -left-10 w-64 h-64 bg-surface-container rounded-full mix-blend-multiply opacity-50"></div>
            <img 
              alt="The Atelier" 
              class="relative z-10 rounded-xl shadow-xl w-full" 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
            />
          </div>
          <div class="w-full md:w-1/2">
            <span class="uppercase tracking-[0.3em] text-[10px] font-label font-bold text-primary mb-6 block">Our Legacy</span>
            <h2 class="text-5xl font-serif mb-8 leading-tight">The Vigo Ethos</h2>
            <p class="text-on-surface-variant font-body text-lg leading-loose mb-10">
              Founded in 2024, VIGO began as a vision to bring luxury fashion to the digital age. Today, we remain an independent house dedicated to the intersection of ancestral craft and futuristic silhouettes. Our materials are sourced exclusively from regenerative artisans who share our vision for a slower, more intentional world.
            </p>
            <div class="flex gap-12">
              <div>
                <span class="block text-3xl font-serif text-primary">100%</span>
                <span class="text-xs uppercase tracking-widest font-label mt-2 block opacity-60">Traceable Materials</span>
              </div>
              <div>
                <span class="block text-3xl font-serif text-primary">12</span>
                <span class="text-xs uppercase tracking-widest font-label mt-2 block opacity-60">Master Craftsmen</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Newsletter Signup -->
      <section class="py-32 bg-stone-900 text-stone-100">
        <div class="max-w-screen-lg mx-auto px-12 text-center">
          <h2 class="text-4xl font-serif mb-6">Join the Inner Circle</h2>
          <p class="text-stone-400 font-body mb-12 max-w-xl mx-auto">
            Be the first to access our private seasonal edits and receive invitations to exclusive atelier showcases.
          </p>
          <form class="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input 
              class="flex-grow bg-transparent border-b border-stone-700 py-3 px-1 focus:outline-none focus:border-amber-500 transition-colors font-body text-stone-100 placeholder:text-stone-600" 
              placeholder="Enter your email" 
              type="email"
            />
            <button class="bg-amber-700 hover:bg-amber-600 px-8 py-3 rounded text-sm font-semibold tracking-[0.15em] uppercase transition-colors" type="submit">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="w-full pt-20 pb-10 bg-stone-100 font-body text-sm leading-relaxed tracking-wide">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 max-w-screen-2xl mx-auto">
        <div class="md:col-span-1">
          <span class="font-serif text-xl mb-4 block text-stone-900">VIGO</span>
          <p class="text-stone-500 mb-6 max-w-xs">An exploration of aesthetic permanence and refined contemporary luxury.</p>
        </div>
        <div class="flex flex-col gap-3">
          <span class="text-stone-900 font-semibold mb-2">Shop</span>
          <NuxtLink to="/products" class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-opacity">Collections</NuxtLink>
          <a class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-opacity">New Arrivals</a>
          <a class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-opacity">Lookbook</a>
        </div>
        <div class="flex flex-col gap-3">
          <span class="text-stone-900 font-semibold mb-2">Service</span>
          <a class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-opacity">Shipping & Returns</a>
          <a class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-opacity">Privacy Policy</a>
          <a class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-opacity">Sustainability</a>
        </div>
        <div class="flex flex-col gap-3">
          <span class="text-stone-900 font-semibold mb-2">Contact</span>
          <a class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-opacity">Contact Us</a>
          <a class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-opacity">Wholesale</a>
        </div>
      </div>
      <div class="mt-20 px-12 max-w-screen-2xl mx-auto border-t border-stone-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-stone-500 text-[10px] uppercase tracking-widest">© 2024 VIGO ATELIER. ALL RIGHTS RESERVED.</p>
        <div class="flex gap-6">
          <span class="material-symbols-outlined text-stone-500 text-lg cursor-pointer hover:text-stone-900">public</span>
          <span class="material-symbols-outlined text-stone-500 text-lg cursor-pointer hover:text-stone-900">share</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated } = useAuth()
const { lastRefreshEvent } = useDataRefresh()

// Fetch featured products for the homepage
const { data: productsData, pending, error, refresh } = await useFetch<any>('/api/products', {
  default: () => ({ items: [] }),
  query: { limit: 4 }
})

// Auto-refresh when admin makes changes (synced across tabs)
watch(lastRefreshEvent, (event) => {
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
