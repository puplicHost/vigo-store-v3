<script setup lang="ts">
const { settings } = useSettings()

const slides = [
  {
    title: "The Art of <br/><span class='italic font-normal text-primary'>Pure Form</span>",
    description: "Explore our curated winter collection, where traditional craftsmanship meets avant-garde minimalist design.",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&q=80",
    link: "/products"
  },
  {
    title: "Timeless <br/><span class='italic font-normal text-primary'>Tailoring</span>",
    description: "Precision-cut silhouettes designed for the modern individual. Quality that endures beyond seasons.",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80",
    link: "/products"
  },
  {
    title: "Refined <br/><span class='italic font-normal text-primary'>Minimalism</span>",
    description: "A sanctuary of style. Discover a palette of neutrals and textures that define contemporary luxury.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80",
    link: "/products"
  }
]

const currentSlide = ref(0)
let slideTimer: any = null

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

onMounted(() => {
  slideTimer = setInterval(nextSlide, 8000)
})

onUnmounted(() => {
  if (slideTimer) clearInterval(slideTimer)
})
</script>

<template>
  <div class="min-h-screen bg-white text-stone-900 selection:bg-primary/10 overflow-x-hidden">
    <main>
      <!-- Hero Slider Section -->
      <section class="relative h-[95vh] bg-stone-900 overflow-hidden group">
        <div 
          v-for="(slide, index) in slides" 
          :key="index"
          class="absolute inset-0 transition-all duration-[2s] ease-in-out transform"
          :class="[
            currentSlide === index ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'
          ]"
        >
          <img 
            :src="slide.image" 
            class="w-full h-full object-cover transition-transform duration-[12s] ease-linear brightness-75"
            :class="{ 'scale-110': currentSlide === index }"
            alt="Hero Narrative"
          />
          
          <div class="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent"></div>
          
          <div class="absolute inset-0 flex flex-col justify-center items-center text-center px-6 md:px-24">
            <div class="max-w-7xl mx-auto space-y-12">
              <div class="overflow-hidden">
                <h1 
                  v-html="slide.title"
                  class="text-6xl md:text-[8rem] lg:text-[11rem] font-serif font-bold text-stone-50 leading-[0.8] -tracking-[0.05em] transition-all duration-[1.5s] delay-300 transform"
                  :class="currentSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-40 opacity-0'"
                ></h1>
              </div>
              
              <div class="flex flex-col items-center gap-10">
                <p 
                  class="font-body text-sm md:text-lg text-stone-300 max-w-xl leading-relaxed italic transition-all duration-1000 delay-700"
                  :class="currentSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'"
                >
                  {{ slide.description }}
                </p>
                
                <div 
                  class="transition-all duration-1000 delay-1000"
                  :class="currentSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'"
                >
                  <NuxtLink 
                    :to="slide.link" 
                    class="group relative inline-flex items-center gap-6 px-16 py-7 bg-primary text-white rounded-full font-label text-[10px] uppercase tracking-[0.5em] font-bold overflow-hidden shadow-2xl transition-all hover:scale-105 active:scale-95"
                  >
                    <span class="relative z-10 italic">Enter the Atelier</span>
                    <span class="material-symbols-outlined text-sm relative z-10 transition-transform group-hover:translate-x-2 italic">arrow_forward</span>
                    <div class="absolute inset-0 bg-stone-950 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Slider Navigation -->
        <div class="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
          <button 
            v-for="(_, index) in slides" 
            :key="index"
            @click="currentSlide = index"
            class="group relative py-4 px-2"
          >
            <div 
              class="h-px bg-white/20 transition-all duration-500 group-hover:bg-white/50"
              :class="currentSlide === index ? 'w-24 bg-primary' : 'w-12'"
            >
              <div 
                v-if="currentSlide === index"
                class="h-full bg-white animate-[progress_8s_linear]" 
                style="width: 100%"
              ></div>
            </div>
          </button>
        </div>
      </section>

      <!-- Best Sellers (Featured Grid) -->
      <StorefrontHomeBestSellers />

      <!-- Narrative Section -->
      <section class="py-48 bg-stone-50/50 flex flex-col items-center text-center px-12 relative overflow-hidden">
        <div class="absolute -top-24 left-1/2 -translate-x-1/2 text-stone-100 text-[18rem] font-serif font-bold italic select-none -z-10 opacity-20">Art</div>
        
        <div class="space-y-12 animate-stagger">
          <span class="text-[10px] uppercase tracking-[0.6em] text-primary font-bold italic">The Philosophy</span>
          <h2 class="text-4xl md:text-7xl font-serif leading-[1.1] max-w-5xl italic text-stone-900 -tracking-[0.02em]">
            &ldquo;We believe in <span class='text-primary italic font-normal'>aesthetic permanence</span>&mdash;pieces that exist beyond the ephemerality of trend.&rdquo;
          </h2>
          <div class="flex flex-col items-center pt-10">
              <div class="w-px h-24 bg-primary/20 mb-10"></div>
              <p class="uppercase tracking-[0.4em] text-[9px] font-bold text-stone-400">Creative Direction <span class="text-stone-900">• {{ settings?.siteName || 'ATELIER' }}</span></p>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
@keyframes progress {
  from { width: 0; }
  to { width: 100%; }
}
</style>
