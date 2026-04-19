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
  <div class="min-h-screen bg-surface text-on-surface overflow-x-hidden">
    <main>
      <!-- Hero Slider Section -->
      <section class="relative h-screen bg-stone-900 overflow-hidden group">
        <div 
          v-for="(slide, index) in slides" 
          :key="index"
          class="absolute inset-0 transition-all duration-[1.5s] ease-in-out transform"
          :class="[
            currentSlide === index ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
          ]"
        >
          <img 
            :src="slide.image" 
            class="w-full h-full object-cover transition-transform duration-[10s] ease-linear"
            :class="{ 'scale-110': currentSlide === index }"
            alt="Hero Background"
          />
          <!-- Strategic Overlay for Readability - Fixed Full Coverage -->
          <div class="absolute inset-x-0 inset-y-0 bg-black/50"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
          
          <div class="absolute inset-0 flex flex-col justify-center items-center text-center px-6 md:px-24 max-w-5xl mx-auto">
            <div class="overflow-hidden mb-8">
              <h1 
                v-html="slide.title"
                class="text-5xl md:text-8xl lg:text-[10rem] font-serif font-bold text-white leading-[0.85] -tracking-[0.04em] transition-all duration-1000 delay-300"
                :class="currentSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'"
              ></h1>
            </div>
            <p 
              class="font-body text-base md:text-xl text-white max-w-2xl mb-14 leading-relaxed transition-all duration-1000 delay-500"
              :class="currentSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'"
            >
              {{ slide.description }}
            </p>
            <div 
              class="flex flex-col items-center gap-6 transition-all duration-1000 delay-700"
              :class="currentSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'"
            >
              <NuxtLink 
                :to="slide.link" 
                class="px-14 py-6 bg-white text-stone-900 rounded-full font-label text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-primary hover:text-white transition-all transform hover:scale-105 active:scale-[0.98] shadow-2xl shadow-black/20"
              >
                Explore Collection
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Slider Controls -->
        <div class="absolute bottom-12 left-12 md:left-24 z-20 flex items-center gap-6">
          <div v-for="(_, index) in slides" :key="index" 
            class="cursor-pointer group flex items-center"
            @click="currentSlide = index"
          >
            <div class="relative w-12 h-[2px] bg-white/20 overflow-hidden">
              <div 
                class="absolute inset-y-0 left-0 bg-white transition-all duration-300"
                :class="currentSlide === index ? 'w-full' : 'w-0'"
              ></div>
            </div>
            <span class="ml-3 text-[10px] uppercase font-bold tracking-widest text-white/40 transition-colors" :class="{ 'text-white': currentSlide === index }">
              0{{ index + 1 }}
            </span>
          </div>
        </div>
      </section>


      <!-- Best Sellers (Featured Grid) -->
      <StorefrontHomeBestSellers />

      <!-- Brand Philosophy / Testimonial Section -->
      <section class="py-32 bg-white flex flex-col items-center text-center px-12 border-t border-stone-100">
        <span class="material-symbols-outlined text-4xl text-primary font-light mb-12">auto_awesome</span>
        <h2 class="text-3xl md:text-5xl font-serif leading-snug max-w-4xl italic text-stone-800">
          "The Vigo Atelier ethos is centered around <br/>aesthetic permanence and the meticulous <br/>pursuit of uncompromised quality."
        </h2>
        <div class="mt-12 flex flex-col items-center">
            <div class="w-px h-16 bg-stone-200 mb-6"></div>
            <span class="uppercase tracking-[0.4em] text-[10px] font-bold text-stone-400">VIGO Creative Direction</span>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
</style>
