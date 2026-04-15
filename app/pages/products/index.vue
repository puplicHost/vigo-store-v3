<template>
  <div class="min-h-screen bg-surface text-on-surface">
    <!-- TopNavBar -->
    <header class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(28,27,27,0.04)]">
      <nav class="flex justify-between items-center px-12 py-6 w-full max-w-screen-2xl mx-auto">
        <NuxtLink to="/" class="text-2xl font-serif italic text-stone-900 tracking-tight">VIGO</NuxtLink>
        <div class="hidden md:flex items-center space-x-10">
          <NuxtLink to="/products" class="text-primary border-b border-primary/30 pb-1 font-serif tracking-tight transition-all duration-300">Collections</NuxtLink>
          <a class="text-stone-600 hover:text-stone-900 transition-colors font-serif tracking-tight">New Arrivals</a>
          <a class="text-stone-600 hover:text-stone-900 transition-colors font-serif tracking-tight">Lookbook</a>
          <a class="text-stone-600 hover:text-stone-900 transition-colors font-serif tracking-tight">Our Story</a>
        </div>
        <div class="flex items-center space-x-6">
          <NuxtLink v-if="!isAuthenticated" to="/auth/login" class="hover:opacity-80 transition-all duration-300 text-stone-600">
            <span class="material-symbols-outlined">person</span>
          </NuxtLink>
          <NuxtLink v-else to="/admin" class="hover:opacity-80 transition-all duration-300 text-stone-600">
            <span class="material-symbols-outlined">dashboard</span>
          </NuxtLink>
          <button class="hover:opacity-80 transition-all duration-300 text-stone-600">
            <span class="material-symbols-outlined">shopping_bag</span>
          </button>
        </div>
      </nav>
    </header>

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
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                  <p class="font-body text-sm font-semibold tracking-tight text-on-surface">${{ (product.price ?? 0).toFixed(2) }}</p>
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

    <!-- Footer -->
    <footer class="w-full pt-20 pb-10 bg-stone-100 font-body text-sm leading-relaxed tracking-wide">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 max-w-screen-2xl mx-auto">
        <div class="col-span-1 md:col-span-1">
          <span class="font-serif text-xl mb-4 block italic">VIGO ATELIER</span>
          <p class="text-stone-500 font-body text-sm leading-relaxed tracking-wide mb-6">Redefining modern luxury through artisanal craftsmanship and sustainable innovation.</p>
        </div>
        <div class="flex flex-col space-y-3">
          <h4 class="text-xs font-label uppercase tracking-widest text-stone-900 mb-2">Service</h4>
          <a class="text-stone-500 font-body text-sm leading-relaxed tracking-wide hover:underline decoration-amber-700/50 underline-offset-4">Shipping & Returns</a>
          <a class="text-stone-500 font-body text-sm leading-relaxed tracking-wide hover:underline decoration-amber-700/50 underline-offset-4">Privacy Policy</a>
          <a class="text-stone-500 font-body text-sm leading-relaxed tracking-wide hover:underline decoration-amber-700/50 underline-offset-4">Contact Us</a>
        </div>
        <div class="flex flex-col space-y-3">
          <h4 class="text-xs font-label uppercase tracking-widest text-stone-900 mb-2">About</h4>
          <a class="text-stone-500 font-body text-sm leading-relaxed tracking-wide hover:underline decoration-amber-700/50 underline-offset-4">Sustainability</a>
          <a class="text-stone-500 font-body text-sm leading-relaxed tracking-wide hover:underline decoration-amber-700/50 underline-offset-4">Wholesale</a>
          <a class="text-stone-500 font-body text-sm leading-relaxed tracking-wide hover:underline decoration-amber-700/50 underline-offset-4">Careers</a>
        </div>
        <div class="flex flex-col space-y-3">
          <h4 class="text-xs font-label uppercase tracking-widest text-stone-900 mb-2">Newsletter</h4>
          <p class="text-xs text-stone-500 mb-4">Subscribe to receive editorial updates and collection launches.</p>
          <div class="relative">
            <input class="w-full bg-transparent border-b border-stone-300 py-2 text-sm focus:border-primary transition-all outline-none" placeholder="Email Address" type="email"/>
            <button class="absolute right-0 bottom-2 text-primary font-label text-xs uppercase tracking-widest">Join</button>
          </div>
        </div>
      </div>
      <div class="mt-20 px-12 max-w-screen-2xl mx-auto border-t border-stone-200/50 pt-10 text-center">
        <span class="text-stone-500 font-body text-sm leading-relaxed tracking-wide">© 2024 VIGO ATELIER. ALL RIGHTS RESERVED.</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
const { isAuthenticated } = useAuth()

// Size filter state
const selectedSize = ref<string | null>(null)

// Fetch products
const { data: products, pending, error } = await useFetch('/api/products', {
  default: () => []
})

// Filter products by selected size
const filteredProducts = computed(() => {
  if (!selectedSize.value) return products.value
  return products.value?.filter(product =>
    product.sizes?.includes(selectedSize.value)
  ) || []
})
</script>
