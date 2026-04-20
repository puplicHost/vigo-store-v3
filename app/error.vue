<template>
  <div class="min-h-screen flex items-center justify-center bg-stone-50 text-stone-900 font-sans">
    <div class="text-center">
      <h1 class="text-9xl font-serif italic text-primary mb-4">{{ error?.statusCode || 500 }}</h1>
      <p class="text-2xl font-body text-stone-500 mb-8">{{ error?.statusMessage || 'An unexpected error occurred.' }}</p>
      <NuxtLink to="/" class="px-8 py-3 bg-stone-900 text-white rounded-full font-label text-sm uppercase tracking-widest hover:bg-primary transition-colors">
        Return Home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError
})
</script>
