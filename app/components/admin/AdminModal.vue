<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
          @click="$emit('update:modelValue', false)"
        ></div>

        <!-- Modal Content -->
        <Transition name="modal-scale">
          <div 
            v-if="modelValue"
            :class="[
              'relative w-full bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/10 overflow-hidden transition-all duration-300',
              maxWidthClass
            ]"
          >
            <!-- Header -->
            <div class="px-8 py-6 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low/30">
              <h2 class="font-serif italic text-2xl text-on-surface">
                <slot name="title">{{ title }}</slot>
              </h2>
              <button 
                @click="$emit('update:modelValue', false)"
                class="p-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant"
              >
                <span class="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <!-- Body -->
            <div class="p-8 max-h-[80vh] overflow-y-auto scrollbar-custom">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="px-8 py-6 border-t border-outline-variant/10 bg-surface-container-low/30">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  title?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
}>()

defineEmits(['update:modelValue'])

const maxWidthClass = computed(() => {
  switch (props.maxWidth) {
    case 'sm': return 'max-w-sm'
    case 'md': return 'max-w-md'
    case 'lg': return 'max-w-lg'
    case 'xl': return 'max-w-xl'
    case '3xl': return 'max-w-3xl'
    case '4xl': return 'max-w-4xl'
    case '2xl':
    default: return 'max-w-2xl'
  }
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-scale-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-scale-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>
