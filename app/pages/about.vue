<template>
  <div class="min-h-screen bg-surface text-on-surface">
    <!-- TopNavBar -->
    <header class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(28,27,27,0.04)]">
      <nav class="flex justify-between items-center px-12 py-6 w-full max-w-screen-2xl mx-auto">
        <NuxtLink to="/" class="text-2xl font-serif italic text-stone-900 tracking-tight">VIGO</NuxtLink>
        <div class="hidden md:flex items-center gap-10">
          <NuxtLink to="/" exact-active-class="text-primary border-b border-primary/30 pb-1" class="text-stone-600 hover:text-stone-900 transition-colors font-serif tracking-tight">Home</NuxtLink>
          <NuxtLink to="/products" active-class="text-primary border-b border-primary/30 pb-1" class="text-stone-600 hover:text-stone-900 transition-colors font-serif tracking-tight">Shop All</NuxtLink>
          <NuxtLink to="/about" active-class="text-primary border-b border-primary/30 pb-1" class="text-stone-600 hover:text-stone-900 transition-colors font-serif tracking-tight">About Us</NuxtLink>
        </div>
        <div class="flex items-center gap-6">
          <NuxtLink :to="isAuthenticated ? '/account' : '/auth/login'" class="hover:opacity-80 transition-all duration-300 text-primary">
            <span class="material-symbols-outlined">person</span>
          </NuxtLink>
          <NuxtLink v-if="isAuthenticated && ['SUPERADMIN', 'ADMIN', 'MANAGER'].includes(user?.role)" to="/admin" title="Dashboard" class="hover:opacity-80 transition-all duration-300 text-primary">
            <span class="material-symbols-outlined">dashboard</span>
          </NuxtLink>
          <NuxtLink v-if="isAuthenticated" to="/cart" class="hover:opacity-80 transition-all duration-300 text-primary relative">
            <span class="material-symbols-outlined">shopping_bag</span>
          </NuxtLink>
        </div>
      </nav>
    </header>

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
            Founded on the principle of uncompromised aesthetic purity, VIGO Atelier bridges the gap between ancestral craftsmanship and modern minimalism. We create pieces designed to endure beyond passing seasons.
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
            <p class="text-secondary font-body leading-relaxed text-sm">Our design philosophy ignores transient trends. VIGO garments are architectural, designed to look as relevant in two decades as they do today.</p>
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
          <span class="uppercase tracking-[0.2em] text-xs font-label text-primary font-bold">VIGO Founders, 2024</span>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="w-full pt-20 pb-10 bg-stone-100 font-body text-sm leading-relaxed tracking-wide">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 max-w-screen-2xl mx-auto">
        <div class="md:col-span-1">
          <span class="font-serif text-xl mb-4 block text-stone-900">{{ settings?.siteName || 'VIGO' }}</span>
          <p class="text-stone-500 mb-6 max-w-xs">{{ settings?.siteDescription || 'An exploration of aesthetic permanence and refined contemporary luxury.' }}</p>
        </div>
        <div class="flex flex-col gap-3">
          <span class="text-stone-900 font-semibold mb-2">Explore</span>
          <NuxtLink to="/" class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-opacity">Home</NuxtLink>
          <NuxtLink to="/products" class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-opacity">Shop All</NuxtLink>
          <NuxtLink to="/about" class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-opacity">About Us</NuxtLink>
        </div>
        <div class="flex flex-col gap-3">
          <span class="text-stone-900 font-semibold mb-2">Service</span>
          <a class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-opacity">Shipping & Returns</a>
          <a class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-opacity">Privacy Policy</a>
        </div>
         <div class="flex flex-col gap-3">
          <span class="text-stone-900 font-semibold mb-2">Contact</span>
          <a v-if="settings?.contactEmail" :href="`mailto:${settings.contactEmail}`" class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-opacity">
            {{ settings.contactEmail }}
          </a>
          <a v-if="settings?.contactPhone" :href="`tel:${settings.contactPhone}`" class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-opacity">
            {{ settings.contactPhone }}
          </a>
          <a v-if="settings?.whatsappNumber" :href="`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`" target="_blank" class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-opacity">
            WhatsApp
          </a>
        </div>
      </div>
      <div class="mt-20 px-12 max-w-screen-2xl mx-auto border-t border-stone-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-stone-500 text-[10px] uppercase tracking-widest">© {{ new Date().getFullYear() }} {{ settings.siteName?.toUpperCase() || 'VIGO ATELIER' }}. ALL RIGHTS RESERVED.</p>
        <div class="flex gap-6">
          <a v-if="settings?.facebookUrl" :href="settings.facebookUrl" target="_blank" class="text-stone-500 hover:text-stone-900 transition-colors">
            <span class="material-symbols-outlined text-lg">public</span>
          </a>
          <a v-if="settings?.instagramUrl" :href="settings.instagramUrl" target="_blank" class="text-stone-500 hover:text-stone-900 transition-colors">
            <span class="material-symbols-outlined text-lg">share</span>
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated, user } = useAuth()
const { settings } = useSettings()

useHead({
  title: `About Us | ${settings.value?.siteName || 'VIGO'}`
})
</script>
