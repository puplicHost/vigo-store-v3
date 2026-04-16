<template>
  <div class="empty-state flex flex-col items-center justify-center p-12 text-center">
    <!-- Icon -->
    <div :class="['w-24 h-24 rounded-full flex items-center justify-center mb-6', iconBgClass]">
      <span :class="['material-symbols-outlined text-5xl', iconClass]">{{ iconName }}</span>
    </div>

    <!-- Title -->
    <h3 class="font-serif italic text-2xl text-on-surface mb-2">
      {{ title }}
    </h3>

    <!-- Description -->
    <p class="text-on-surface-variant/70 font-body mb-6 max-w-md">
      {{ description }}
    </p>

    <!-- Action Button -->
    <slot name="action">
      <button
        v-if="actionText"
        @click="$emit('action')"
        class="btn-gradient px-6 py-3 rounded-lg text-on-primary font-label text-[11px] uppercase tracking-[0.2em] hover:opacity-90 transition-opacity"
      >
        <span class="material-symbols-outlined text-sm align-middle mr-2">{{ actionIcon }}</span>
        {{ actionText }}
      </button>
    </slot>

    <!-- Custom Content -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title?: string
  description?: string
  icon?: string
  type?: 'products' | 'orders' | 'users' | 'categories' | 'settings' | 'general'
  actionText?: string
  actionIcon?: string
}>()

defineEmits<{
  action: []
}>()

const iconBgClass = computed(() => {
  switch (props.type) {
    case 'products': return 'bg-primary/10'
    case 'orders': return 'bg-secondary/10'
    case 'users': return 'bg-tertiary/10'
    case 'categories': return 'bg-primary/10'
    case 'settings': return 'bg-surface-container-low'
    case 'general': return 'bg-surface-container-low'
    default: return 'bg-surface-container-low'
  }
})

const iconClass = computed(() => {
  switch (props.type) {
    case 'products': return 'text-primary'
    case 'orders': return 'text-secondary'
    case 'users': return 'text-tertiary'
    case 'categories': return 'text-primary'
    case 'settings': return 'text-on-surface-variant'
    case 'general': return 'text-on-surface-variant'
    default: return 'text-on-surface-variant'
  }
})

const iconName = computed(() => {
  if (props.icon) return props.icon
  
  switch (props.type) {
    case 'products': return 'inventory_2'
    case 'orders': return 'shopping_bag'
    case 'users': return 'person'
    case 'categories': return 'folder'
    case 'settings': return 'settings'
    case 'general': return 'inbox'
    default: return 'inbox'
  }
})
</script>
