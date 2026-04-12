<template>
  <div class="bg-surface text-on-surface min-h-screen flex flex-col">
    <main class="flex-grow flex flex-col items-center justify-center px-8 py-16 bg-surface-container-lowest">
      <NuxtPage />
    </main>
    
    <footer class="bg-surface-container-low dark:bg-[#121111] w-full py-8 mt-auto flex flex-col md:flex-row justify-between items-center px-12 gap-4 border-t border-outline-variant/10">
      <div class="text-lg font-serif italic text-[#1c1b1b] dark:text-[#fcf9f8]">THE ATELIER</div>
      <div class="flex gap-8">
        <a href="#" class="font-sans text-[10px] uppercase tracking-[0.2em] text-[#1c1b1b]/60 dark:text-[#fcf9f8]/60 hover:text-[#775a19] transition-colors">Privacy Policy</a>
        <a href="#" class="font-sans text-[10px] uppercase tracking-[0.2em] text-[#1c1b1b]/60 dark:text-[#fcf9f8]/60 hover:text-[#775a19] transition-colors">Terms of Service</a>
        <a href="#" class="font-sans text-[10px] uppercase tracking-[0.2em] text-[#1c1b1b]/60 dark:text-[#fcf9f8]/60 hover:text-[#775a19] transition-colors">Accessibility</a>
      </div>
      <div class="font-sans text-[10px] uppercase tracking-[0.2em] text-[#775a19] dark:text-[#C5A059]">
        © 2024 THE ATELIER. ALL RIGHTS RESERVED.
      </div>
    </footer>
  </div>
</template>
