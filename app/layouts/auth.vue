<template>
  <div class="bg-white text-on-surface min-h-screen flex flex-col font-sans selection:bg-primary/20">
    <!-- Centered Header Logo -->
    <header class="py-12 md:py-20 flex justify-center fade-up">
      <h1 class="text-3xl md:text-4xl font-serif italic tracking-[0.3em] text-on-surface uppercase">
        {{ settings?.siteName || 'THE ATELIER' }}
      </h1>
    </header>

    <!-- Main Content Shell -->
    <main class="flex-grow flex flex-col items-center px-6 md:px-8 pb-20 overflow-y-auto">
      <div class="w-full max-w-lg flex flex-col items-center">
        <NuxtPage />
      </div>
    </main>

    <!-- Minimalist Footer -->
    <footer class="py-12 border-t border-stone-100 bg-stone-50/50 flex flex-col items-center gap-8 fade-up">
      <div class="flex flex-wrap justify-center gap-x-12 gap-y-4">
        <a href="#" class="text-[10px] uppercase tracking-[0.2em] text-stone-400 hover:text-primary transition-colors font-bold">Privacy Policy</a>
        <a href="#" class="text-[10px] uppercase tracking-[0.2em] text-stone-400 hover:text-primary transition-colors font-bold">Terms of Service</a>
        <a href="#" class="text-[10px] uppercase tracking-[0.2em] text-stone-400 hover:text-primary transition-colors font-bold">Accessibility</a>
      </div>
      <div class="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">
        © {{ new Date().getFullYear() }} {{ settings?.siteName || 'THE ATELIER' }}. ALL RIGHTS RESERVED.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { settings } = useSettings()
</script>
