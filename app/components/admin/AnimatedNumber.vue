<template>
  <span>{{ displayValue }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: number
  duration?: number
  format?: 'number' | 'currency'
  currencySymbol?: string
}>()

const displayValue = ref(props.format === 'currency' ? `${props.currencySymbol || ''}0` : '0')
const currentVal = ref(0)
let startTime: number | null = null

const animate = (timestamp: number) => {
  if (!startTime) startTime = timestamp
  const progress = Math.min((timestamp - startTime) / (props.duration || 1000), 1)
  currentVal.value = Math.floor(progress * props.value)
  
  if (props.format === 'currency') {
    displayValue.value = `${props.currencySymbol || ''}${currentVal.value.toLocaleString()}`
  } else {
    displayValue.value = currentVal.value.toLocaleString()
  }

  if (progress < 1) {
    requestAnimationFrame(animate)
  } else {
    // Final value precision
    if (props.format === 'currency') {
      displayValue.value = `${props.currencySymbol || ''}${props.value.toLocaleString()}`
    } else {
      displayValue.value = props.value.toLocaleString()
    }
  }
}

watch(() => props.value, (newVal) => {
  currentVal.value = 0
  startTime = null
  requestAnimationFrame(animate)
}, { immediate: true })
</script>
