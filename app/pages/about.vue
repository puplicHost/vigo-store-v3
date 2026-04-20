<template>
  <div class="min-h-screen bg-surface text-on-surface">
    <main class="pt-32 pb-24 px-6 md:px-12 max-w-screen-xl mx-auto">
      <!-- Breadcrumb -->
      <nav class="mb-16 flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-on-surface-variant font-label">
        <NuxtLink to="/" class="hover:text-primary transition-colors">Home</NuxtLink>
        <span class="material-symbols-outlined text-[14px]">chevron_right</span>
        <span class="text-on-surface font-semibold">About Our Maison</span>
      </nav>

      <!-- Hero Section -->
      <section class="mb-24 flex flex-col md:flex-row gap-16 items-center">
        <div class="w-full md:w-1/2">
          <h1 class="text-5xl md:text-7xl font-serif tracking-tighter text-on-surface leading-none mb-8">
            The Art of <br/><span class="italic text-primary">Permanence</span>
          </h1>
          <p class="text-lg font-body text-secondary leading-relaxed max-w-md">
            Founded on the principle of uncompromised aesthetic purity, {{ settings?.siteName || 'VIGO Atelier' }} bridges the gap between ancestral craftsmanship and modern minimalism. We create pieces designed to endure beyond passing seasons.
          </p>
        </div>
        <div class="w-full md:w-1/2 relative aspect-[4/5] rounded-tl-[100px] rounded-br-[100px] overflow-hidden">
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" alt="Atelier Interior" class="w-full h-full object-cover"/>
        </div>
      </section>

      <!-- Values Grid -->
      <section class="py-20 border-t border-b border-outline-variant/20 mb-24">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div class="flex flex-col md:items-start items-center">
            <span class="material-symbols-outlined text-4xl text-primary mb-6">eco</span>
            <h3 class="text-xl font-serif mb-4">Ethical Sourcing</h3>
            <p class="text-secondary font-body leading-relaxed text-sm">Every thread, leather hide, and dye used in our atelier is meticulously sourced from regenerative farms and ethical tanneries to ensure zero compromise on nature.</p>
          </div>
          <div class="flex flex-col md:items-start items-center">
            <span class="material-symbols-outlined text-4xl text-primary mb-6">handyman</span>
            <h3 class="text-xl font-serif mb-4">Master Craftsmanship</h3>
            <p class="text-secondary font-body leading-relaxed text-sm">We employ only the most skilled artisans, dedicating hundreds of hours to a single piece to achieve a level of refinement impossible through mass production.</p>
          </div>
          <div class="flex flex-col md:items-start items-center">
            <span class="material-symbols-outlined text-4xl text-primary mb-6">all_inclusive</span>
            <h3 class="text-xl font-serif mb-4">Timeless Silhouettes</h3>
            <p class="text-secondary font-body leading-relaxed text-sm">Our design philosophy ignores transient trends. {{ settings?.siteName || 'VIGO' }} garments are architectural, designed to look as relevant in two decades as they do today.</p>
          </div>
        </div>
      </section>

      <!-- The Atelier Picture -->
      <section class="max-w-screen-lg mx-auto mb-24">
        <div class="aspect-video w-full rounded-2xl overflow-hidden relative mb-12 shadow-2xl shadow-primary/5">
          <img src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&q=80" alt="Craftsmanship" class="w-full h-full object-cover"/>
          <div class="absolute inset-0 bg-stone-900/20 mix-blend-multiply"></div>
        </div>
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-3xl font-serif italic mb-6">"True luxury is found in the unseen details — the perfect stitch, the weight of the fabric, the intention behind the design."</h2>
          <span class="uppercase tracking-[0.2em] text-xs font-label text-primary font-bold">{{ settings?.siteName || 'VIGO' }} Founders, 2024</span>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated, user } = useAuth()
const { settings } = useSettings()

useHead({
  title: 'About Us'
})
</script>
