<template>
  <section class="py-24 bg-white overflow-hidden">
    <div class="max-w-screen-2xl mx-auto px-12">
      <div class="flex items-end justify-between mb-16">
        <div class="max-w-xl">
          <span class="uppercase tracking-[0.3em] text-[10px] font-bold text-primary mb-4 block">Categories</span>
          <h2 class="text-5xl font-serif leading-tight">Archetypes of <br/><span class="italic">Modern Tailoring</span></h2>
        </div>
        <NuxtLink to="/products" class="group flex items-center gap-3 font-label text-xs uppercase tracking-[0.2em] pb-2 border-b border-stone-200 hover:border-primary transition-colors">
          Explore All
          <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="(category, index) in displayCategories" :key="category.id" 
          class="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100 cursor-pointer"
          @click="navigateTo(`/products?category=${category.id}`)"
        >
          <img 
            :src="categoryImages[index] || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80'" 
            class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-stone-900/20 group-hover:bg-stone-900/40 transition-colors pointer-events-none"></div>
          <div class="absolute inset-0 p-8 flex flex-col justify-end">
            <h3 class="text-white text-3xl font-serif mb-2">{{ category.name }}</h3>
            <p class="text-white/80 text-xs uppercase tracking-widest font-label opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
              Discover Collection
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: categories } = await useApiFetch<any[]>('/api/categories')

const displayCategories = computed(() => {
  return categories.value?.slice(0, 3) || []
})

const categoryImages = [
  'https://images.unsplash.com/photo-1594932224010-75f430ca0956?w=800&q=80', // Shirts/Suits
  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80', // Denims/Trousers
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80'  // Accessories/Dresses
]
</script>
