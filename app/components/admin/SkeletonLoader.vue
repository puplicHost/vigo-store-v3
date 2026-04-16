<template>
  <div class="skeleton-loader" :class="type">
    <!-- Card Skeleton -->
    <div v-if="type === 'card'" class="bg-surface-container-lowest rounded-xl p-6 space-y-4">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg bg-surface-container-low animate-pulse"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-surface-container-low rounded w-1/3 animate-pulse"></div>
          <div class="h-3 bg-surface-container-low rounded w-1/4 animate-pulse"></div>
        </div>
      </div>
      <div class="h-3 bg-surface-container-low rounded w-full animate-pulse"></div>
      <div class="h-3 bg-surface-container-low rounded w-2/3 animate-pulse"></div>
    </div>

    <!-- Table Row Skeleton -->
    <div v-else-if="type === 'table-row'" class="flex items-center gap-4 p-4 bg-surface-container-lowest">
      <div class="w-12 h-12 rounded-lg bg-surface-container-low animate-pulse"></div>
      <div class="flex-1 space-y-2">
        <div class="h-4 bg-surface-container-low rounded w-1/3 animate-pulse"></div>
        <div class="h-3 bg-surface-container-low rounded w-1/4 animate-pulse"></div>
      </div>
      <div class="h-8 w-20 bg-surface-container-low rounded animate-pulse"></div>
    </div>

    <!-- Stats Card Skeleton -->
    <div v-else-if="type === 'stats'" class="bg-surface-container-lowest rounded-xl p-6 space-y-4">
      <div class="flex items-center justify-between">
        <div class="w-14 h-14 rounded-xl bg-surface-container-low animate-pulse"></div>
        <div class="w-16 h-6 bg-surface-container-low rounded-full animate-pulse"></div>
      </div>
      <div class="h-8 bg-surface-container-low rounded w-1/3 animate-pulse"></div>
      <div class="h-2 bg-surface-container-low rounded w-full animate-pulse"></div>
    </div>

    <!-- Avatar Skeleton -->
    <div v-else-if="type === 'avatar'" class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-surface-container-low animate-pulse"></div>
      <div class="space-y-2">
        <div class="h-4 bg-surface-container-low rounded w-24 animate-pulse"></div>
        <div class="h-3 bg-surface-container-low rounded w-16 animate-pulse"></div>
      </div>
    </div>

    <!-- Text Skeleton -->
    <div v-else-if="type === 'text'" class="space-y-2">
      <div class="h-4 bg-surface-container-low rounded animate-pulse" :style="{ width: width }"></div>
      <div v-if="(lines ?? 0) > 1" class="h-4 bg-surface-container-low rounded animate-pulse" :style="{ width: '80%' }"></div>
      <div v-if="(lines ?? 0) > 2" class="h-4 bg-surface-container-low rounded animate-pulse" :style="{ width: '60%' }"></div>
    </div>

    <!-- Default/Block Skeleton -->
    <div v-else class="bg-surface-container-low rounded animate-pulse" :style="{ width: width, height: height }"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  type?: 'card' | 'table-row' | 'stats' | 'avatar' | 'text' | 'block'
  width?: string
  height?: string
  lines?: number
}>()
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
