<template>
  <nav class="flex mb-6" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-2 rtl:space-x-reverse">
      <li class="flex items-center">
        <NuxtLink 
          to="/admin/dashboard" 
          class="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
        >
          <span class="material-symbols-outlined text-lg">dashboard</span>
          <span class="font-label text-[10px] uppercase tracking-wider font-bold">{{ $t('sidebar.dashboard') }}</span>
        </NuxtLink>
      </li>
      
      <li v-for="(crumb, index) in crumbs" :key="crumb.path" class="flex items-center">
        <span class="material-symbols-outlined text-on-surface-variant/30 text-sm mx-1">chevron_right</span>
        <NuxtLink 
          v-if="index < crumbs.length - 1"
          :to="crumb.path" 
          class="text-on-surface-variant hover:text-primary transition-colors font-label text-[10px] uppercase tracking-wider font-bold"
        >
          {{ crumb.label }}
        </NuxtLink>
        <span 
          v-else 
          class="text-primary font-label text-[10px] uppercase tracking-wider font-bold"
        >
          {{ crumb.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()

const crumbs = computed(() => {
  const pathArray = route.path.split('/').filter(p => p && p !== 'admin')
  const breadcrumbs = []
  let path = '/admin'

  for (const part of pathArray) {
    path += `/${part}`
    // Try to translate the part, or use the part itself if no translation found
    const label = t(`breadcrumbs.${part}`, part.replace(/-/g, ' '))
    breadcrumbs.push({
      label,
      path
    })
  }

  return breadcrumbs
})
</script>
