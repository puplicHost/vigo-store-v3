<template>
  <footer class="w-full bg-stone-900 text-stone-300 font-body transition-colors duration-500">
    <!-- Main Footer Content -->
    <div class="max-w-screen-2xl mx-auto px-10 md:px-16 pt-24 pb-16">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
        
        <!-- Brand Section -->
        <div class="md:col-span-4 flex flex-col gap-8">
          <div class="flex flex-col gap-4">
            <span class="font-serif text-3xl text-white tracking-tight uppercase italic">{{ settings?.siteName || 'VIGO ATELIER' }}</span>
            <div class="h-px w-12 bg-primary/40"></div>
          </div>
          <p class="text-stone-400 text-base leading-relaxed max-w-sm">
            {{ settings?.siteDescription || 'Curating a collection of refined contemporary luxury and aesthetic permanence. Every piece tells a story of craftsmanship and legacy.' }}
          </p>
          
          <!-- Social Icons -->
          <div class="flex gap-5 items-center mt-4">
            <a v-if="settings?.facebookUrl" :href="settings.facebookUrl" target="_blank" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-stone-400 hover:text-primary hover:border-primary/40 transition-all duration-300 group" aria-label="Facebook">
              <svg class="w-5 h-5 fill-current transform group-hover:scale-110 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a v-if="settings?.instagramUrl" :href="settings.instagramUrl" target="_blank" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-stone-400 hover:text-primary hover:border-primary/40 transition-all duration-300 group" aria-label="Instagram">
              <svg class="w-5 h-5 fill-current transform group-hover:scale-110 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.28.058 1.688.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.669-.072-4.949-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a v-if="settings?.tiktokUrl" :href="settings.tiktokUrl" target="_blank" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-stone-400 hover:text-primary hover:border-primary/40 transition-all duration-300 group" aria-label="TikTok">
              <svg class="w-5 h-5 fill-current transform group-hover:scale-110 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.31-.75.42-1.24 1.25-1.33 2.1-.1.7.1 1.41.47 2.01.41.68 1.14 1.16 1.91 1.25.91.14 1.9-.12 2.67-.62.83-.53 1.34-1.45 1.45-2.42.03-3.31.02-6.63.02-9.95z"/>
              </svg>
            </a>
            <a v-if="settings?.snapchatUrl" :href="settings.snapchatUrl" target="_blank" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-stone-400 hover:text-primary hover:border-primary/40 transition-all duration-300 group" aria-label="Snapchat">
              <svg class="w-5 h-5 fill-current transform group-hover:scale-110 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-.26 0-.528.01-.795.03C5.594.43 1.107 4.965.733 10.518c-.023.33-.035.666-.035 1.004 0 2.274.685 4.382 1.862 6.126-.06.27-.13.54-.21.802-.128.423-.312.825-.548 1.203-.138.223-.3.433-.483.626l-.27.284c-.166.17-.184.446-.04.64.143.19.414.24.613.11.08-.052.164-.1.25-.138l1.32-.577c1.17-.514 2.455-.78 3.754-.78h.082c1.64.015 3.01.21 4.14.593l1.24.422C12.35 24 12 24 12 24s-.35.003-.593-.058l1.24-.42c1.13-.385 2.5-.58 4.14-.595h.082c1.3 0 2.583.265 3.753.78l1.32.576c.086.038.17.086.25.138.2.13.47.08.614-.11.144-.194.126-.47-.04-.64l-.27-.284c-.184-.193-.346-.403-.483-.626-.236-.378-.42-.78-.548-1.203-.08-.263-.15-.533-.21-.803 1.178-1.744 1.864-3.852 1.864-6.126 0-.338-.012-.674-.035-1.004-.374-5.553-4.86-10.087-10.472-10.488C12.528.01 12.26 0 12 0zm1.758 13.918c-.29.176-.6.313-.918.413-.263.08-.532.12-.802.12-.138 0-.276-.01-.413-.03-.217-.033-.424-.093-.618-.175-.125-.054-.24-.117-.353-.186-.41.252-1.033.454-1.745.54-.347.04-.73.06-1.123-.017-1-.2-1.522-1.054-1.554-1.107-.1-.17-.06-.385.08-.507.08-.07.19-.1.29-.1l.16.03s.06.01.12.03c.51.13 1.05.08 1.54-.15.2-.09.38-.2.53-.34-.4-.5-.65-1.11-.73-1.75-.02-.13-.03-.26-.03-.4s.01-.27.03-.4c.08-.63.33-1.23.73-1.74.12-.15.26-.28.41-.4-.6-.2-1.09-.58-1.42-1.1-.11-.17-.07-.4.09-.54.17-.14.41-.12.55.03l.03.04c.18.27.44.49.74.63.15.07.31.13.48.16.14.03.28.04.42.04h-.02c-.57 0 1.1-.2 1.5-.56.09-.08.17-.16.24-.26.29-.41.43-.91.4-1.41-.02-.38-.15-.75-.38-1.06-.07-.1-.15-.18-.23-.26-.29-.26-.64-.44-1.03-.53-.14-.03-.28-.04-.42-.04h-.02c-.52 0-1.01.2-1.38.56-.04.04-.08.08-.12.12-.34.38-.54.87-.58 1.38-.03.3-.01.62.06.91.07.28.21.54.4.77.16.2.37.37.6.5.03.02.05.04.08.06.18.1.37.16.59.18.17.02.34-.01.49-.09.2-.1.35-.29.41-.51.06-.23.01-.46-.14-.64-.04-.05-.09-.09-.15-.13-.13-.08-.18-.24-.13-.39.05-.15.21-.24.36-.2.27.06.52.18.73.34.4.31.69.75.81 1.25.13.52.09 1.07-.1 1.55-.07.16-.16.32-.26.46-.22.3-.5.55-.83.74-.23.13-.48.22-.74.27-.14.03-.28.04-.42.04h-.02c-.14 0-.27 0-.4-.01-.32-.03-.63-.12-.92-.26-.14-.07-.27-.15-.39-.24-.44-.33-.76-.8-.9-1.33-.13-.53-.08-1.08.13-1.58.07-.17.17-.32.28-.46.33-.42.79-.75 1.3-.92.17-.06.35-.1.53-.12.57-.06 1.15.03 1.67.27.17.08.33.17.48.28.53.39.9 1.02.9 1.02s.01.12.03.24c.03.14.07.28.12.41.05.13.12.25.2.36l.03.04c.16.2.14.5-.04.68-.13.13-.33.17-.5.1-.1-.04-.19-.1-.26-.18z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="md:col-span-3 md:ml-auto">
          <span class="text-white font-medium mb-8 block font-serif italic text-lg tracking-tight uppercase tracking-widest">Explore</span>
          <nav class="flex flex-col gap-4">
            <NuxtLink v-for="link in ['Home', 'Shop All', 'About Us', 'Contact']" :key="link" :to="link === 'Home' ? '/' : '/' + link.toLowerCase().replace(' ', '')" class="text-stone-500 hover:text-primary transition-all duration-300 transform hover:translate-x-1">
              {{ link }}
            </NuxtLink>
          </nav>
        </div>

        <!-- Support Section -->
        <div class="md:col-span-3 md:ml-auto">
          <span class="text-white font-medium mb-8 block font-serif italic text-lg tracking-tight uppercase tracking-widest">Support</span>
          <nav class="flex flex-col gap-4">
            <a href="#" class="text-stone-500 hover:text-primary transition-all duration-300 transform hover:translate-x-1">Shipping & Returns</a>
            <a href="#" class="text-stone-500 hover:text-primary transition-all duration-300 transform hover:translate-x-1">Privacy Policy</a>
            <a href="#" class="text-stone-500 hover:text-primary transition-all duration-300 transform hover:translate-x-1">Terms of Service</a>
            <a href="#" class="text-stone-500 hover:text-primary transition-all duration-300 transform hover:translate-x-1">FAQ</a>
          </nav>
        </div>

        <!-- Contact Section -->
        <div class="md:col-span-2 md:ml-auto">
          <span class="text-white font-medium mb-8 block font-serif italic text-lg tracking-tight uppercase tracking-widest">Contact</span>
          <nav class="flex flex-col gap-6">
            <div class="flex flex-col gap-1">
              <span class="text-[9px] uppercase tracking-[0.3em] text-primary/60 font-bold">Mail</span>
              <a href="mailto:concierge@vigo.store" class="text-stone-400 hover:text-white transition-colors text-sm tracking-wide">concierge@vigo.store</a>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-[9px] uppercase tracking-[0.3em] text-primary/60 font-bold">Phone</span>
              <a href="tel:+201000000000" class="text-stone-400 hover:text-white transition-colors text-sm tracking-wide">+20 100 000 000</a>
            </div>
          </nav>
        </div>

      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="max-w-screen-2xl mx-auto px-10 md:px-16 border-t border-white/5 py-12 flex flex-col items-center gap-8">
      <div class="flex flex-col items-center gap-2 text-center">
        <p class="text-stone-600 text-[10px] uppercase tracking-[0.3em]">
          © {{ new Date().getFullYear() }} {{ settings.siteName || 'VIGO' }} . ALL RIGHTS RESERVED.
        </p>
        <p class="text-stone-500 text-[10px] uppercase tracking-[0.3em]">
          Designed by <a href="https://yaaalla.com/" target="_blank" class="text-primary hover:opacity-80 transition-opacity font-bold">Yaaalla</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { settings } = useSettings()
</script>

<style scoped>
</style>
