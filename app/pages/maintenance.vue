<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-container-low p-4">
    <div class="bg-white rounded-2xl shadow-lg shadow-primary/5 p-12 max-w-lg w-full text-center">
      <div class="mb-6">
        <span class="material-symbols-outlined text-6xl text-primary">construction</span>
      </div>
      <h1 class="font-serif italic text-3xl text-on-surface mb-4">Under Maintenance</h1>
      <p class="text-on-surface-variant font-body mb-8">
        {{ maintenanceMessage || 'We are currently performing maintenance. Please check back soon.' }}
      </p>
      <div class="flex items-center justify-center gap-2 text-sm text-on-surface-variant font-body">
        <span class="material-symbols-outlined text-sm">schedule</span>
        <span>We'll be back shortly</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const maintenanceMessage = ref('')

onMounted(async () => {
  try {
    const settings = await $fetch('/api/admin/settings')
    maintenanceMessage.value = settings?.settings?.maintenanceMessage || ''
  } catch (error) {
    // Fallback to default message
  }
})
</script>
