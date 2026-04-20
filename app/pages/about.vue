<template>
  <div class="min-h-screen bg-white text-stone-900 selection:bg-primary/10 overflow-x-hidden">
    <main class="pt-40 pb-32 px-6 md:px-12 max-w-screen-2xl mx-auto space-y-32">
      
      <!-- Narrative Narrative -->
      <section class="max-w-7xl mx-auto space-y-16 animate-stagger">
         <nav class="text-[10px] uppercase tracking-[0.6em] text-stone-300 font-bold italic">
            <NuxtLink to="/" class="hover:text-primary transition-colors">The Atelier</NuxtLink>
            <span class="mx-3 opacity-30">/</span>
            <span class="text-stone-900">Maison Philosophy</span>
         </nav>
         
         <div class="flex flex-col lg:flex-row gap-20 items-end">
            <div class="flex-1 space-y-12">
               <h1 class="text-7xl md:text-[8rem] lg:text-[10rem] font-serif font-bold text-stone-900 leading-[0.8] -tracking-[0.05em] italic">
                  The Art of <br/><span class="text-primary font-normal not-italic">Refinement</span>
               </h1>
               <p class="text-xl md:text-2xl font-body text-stone-400 leading-relaxed max-w-2xl italic font-medium">
                  Founded on the principle of uncompromised aesthetic purity, <span class="text-stone-900">{{ settings?.siteName || 'VIGO ATELIER' }}</span> bridges the gap between ancestral heritage and avant-garde silhouette.
               </p>
            </div>
            <div class="w-full lg:w-1/3 aspect-[3/4] bg-stone-50 rounded-[4rem] overflow-hidden border border-stone-100 shadow-2xl shadow-primary/5 p-4 group">
               <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" alt="Atelier Interior" class="w-full h-full object-cover rounded-[3rem] transition-transform duration-[3s] group-hover:scale-110"/>
            </div>
         </div>
      </section>

      <!-- Philosophy Grid -->
      <section class="py-32 border-y border-stone-50 relative">
        <div class="absolute -top-12 left-0 text-[12rem] font-serif font-bold italic text-stone-50 select-none -z-10 opacity-40">Spirit</div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-20">
          <div class="space-y-8 animate-stagger">
            <span class="text-[9px] uppercase tracking-[0.6em] text-primary font-bold italic">Ethos 01</span>
            <h3 class="text-3xl font-serif font-bold italic text-stone-900 tracking-tight">Ethical Provenance</h3>
            <p class="text-sm text-stone-400 font-body leading-relaxed italic font-medium">Every fiber in our archive is meticulously traced. We collaborate only with regenerative estates that uphold the dignity of the natural world.</p>
            <div class="w-12 h-px bg-primary/20"></div>
          </div>
          <div class="space-y-8 animate-stagger">
            <span class="text-[9px] uppercase tracking-[0.6em] text-primary font-bold italic">Ethos 02</span>
            <h3 class="text-3xl font-serif font-bold italic text-stone-900 tracking-tight">Master Dialect</h3>
            <p class="text-sm text-stone-400 font-body leading-relaxed italic font-medium">Our artisans dedicated thousands of hours to a single silhouette. We speak in the silent language of the perfect stitch and the architectural fold.</p>
            <div class="w-12 h-px bg-primary/20"></div>
          </div>
          <div class="space-y-8 animate-stagger">
            <span class="text-[9px] uppercase tracking-[0.6em] text-primary font-bold italic">Ethos 03</span>
            <h3 class="text-3xl font-serif font-bold italic text-stone-900 tracking-tight">Eternal Form</h3>
            <p class="text-sm text-stone-400 font-body leading-relaxed italic font-medium">We do not design for time. We design beyond it. Each piece is a sanctuary of proportion, meant to exist as a permanent artifact in your capsule.</p>
            <div class="w-12 h-px bg-primary/20"></div>
          </div>
        </div>
      </section>

      <!-- Visionary Manifest -->
      <section class="max-w-6xl mx-auto py-24 text-center space-y-16">
        <div class="aspect-[21/9] w-full rounded-[4rem] overflow-hidden relative shadow-3xl shadow-stone-900/10 group">
          <img src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&q=80" alt="Craftsmanship Narrative" class="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110"/>
          <div class="absolute inset-0 bg-stone-900/30 mix-blend-multiply"></div>
          <div class="absolute inset-0 flex items-center justify-center">
             <div class="w-32 h-32 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md overflow-hidden group/play cursor-pointer">
                <div class="w-full h-full bg-white/10 flex items-center justify-center transform group-hover/play:scale-150 transition-transform duration-1000">
                   <span class="material-symbols-outlined text-white text-3xl font-light italic">motion_blur</span>
                </div>
             </div>
          </div>
        </div>
        
        <div class="max-w-4xl mx-auto space-y-10 animate-stagger">
          <h2 class="text-4xl md:text-6xl font-serif italic font-bold text-stone-900 leading-snug tracking-tight">
            &ldquo;True luxury is found in the <span class='text-primary italic font-normal'>unseen details</span> &mdash; where intention meets permanence.&rdquo;
          </h2>
          <div class="flex flex-col items-center gap-6">
              <div class="w-px h-16 bg-stone-100"></div>
              <span class="uppercase tracking-[0.5em] text-[10px] font-bold text-stone-300 italic">Creative Direction Narrative, {{ settings?.siteName || 'ATELIER' }} • {{ new Date().getFullYear() }}</span>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const { settings } = useSettings()

useHead({
  title: 'About Our Maison'
})
</script>
