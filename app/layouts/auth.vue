<template>
  <div class="bg-surface text-on-surface min-h-screen flex flex-col md:flex-row">
    <!-- Left Side: Decorative Panel (Desktop Only) -->
    <section class="hidden md:flex md:w-1/2 metallic-gradient flex-col items-center justify-center p-12 relative">
      <div class="z-10 text-center max-w-lg space-y-6">
        <h1 class="text-5xl font-serif italic tracking-[0.25em] text-on-primary mb-4 drop-shadow-sm">
          THE ATELIER
        </h1>
        <div class="h-px w-24 bg-on-primary/30 mx-auto"></div>
        <p class="text-on-primary/80 font-serif text-xl italic leading-relaxed tracking-wide">
          "Where craftsmanship meets digital elegance."
        </p>
      </div>
      
      <!-- Subtle Decorative Element -->
      <div class="absolute bottom-12 left-12 text-on-primary/40 font-label text-[10px] uppercase tracking-[0.4em]">
        Est. 2024 — Private Salon
      </div>
    </section>

    <!-- Right Side: Content Area (Mobile & Desktop) -->
    <main class="w-full md:w-1/2 flex flex-col items-center px-8 py-16 md:py-24 bg-surface-container-lowest min-h-screen relative overflow-y-auto">
      <!-- Mobile Logo (Shown only on small screens) -->
      <div class="md:hidden mb-12 text-center fade-up shrink-0">
        <h1 class="text-2xl font-serif italic tracking-[0.2em] text-on-surface">THE ATELIER</h1>
      </div>

      <div class="w-full max-w-md w-full flex-grow flex flex-col justify-center">
        <NuxtPage />
      </div>

      <!-- Footer (Integrated into content area) -->
      <div class="mt-16 w-full max-w-md pt-8 border-t border-outline-variant/10 flex flex-col items-center gap-4 fade-up shrink-0" style="animation-delay: 600ms;">
        <div class="flex gap-6">
          <a href="#" class="font-sans text-[9px] uppercase tracking-[0.2em] text-on-surface-variant/60 hover:text-primary transition-colors">Privacy</a>
          <a href="#" class="font-sans text-[9px] uppercase tracking-[0.2em] text-on-surface-variant/60 hover:text-primary transition-colors">Terms</a>
          <a href="#" class="font-sans text-[9px] uppercase tracking-[0.2em] text-on-surface-variant/60 hover:text-primary transition-colors">Accessibility</a>
        </div>
        <div class="font-sans text-[9px] uppercase tracking-[0.2em] text-primary/60 italic">
          © 2024 THE ATELIER.
        </div>
      </div>
    </main>
  </div>
</template>
