<template>
  <div>
    <NuxtRouteAnnouncer />
    <TheToasts />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { settings } = useSettings()

useHead({
  title: settings.value?.siteName || 'Vigo Store',
  titleTemplate: () => settings.value?.siteName || 'Vigo Store',
  meta: [
    { name: 'description', content: settings.value?.siteDescription || 'Modern Editorial E-commerce' },
    { name: 'keywords', content: settings.value?.siteKeywords || 'fashion, luxury, atelier' }
  ],
  link: [
    {
      key: 'favicon',
      rel: 'icon',
      href: settings.value?.logo || '/favicon.ico'
    },
    {
      key: 'shortcut-icon',
      rel: 'shortcut icon',
      href: settings.value?.logo || '/favicon.ico'
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'
    },
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css'
    }

  ],
  style: [
    {
      children: `
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-weight: normal;
          font-style: normal;
          font-size: 24px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          -webkit-font-feature-settings: 'liga';
          -webkit-font-smoothing: antialiased;
          font-variation-settings:
            'FILL' 0,
            'wght' 400,
            'GRAD' 0,
            'opsz' 24;
        }
      `
    }
  ]
})
</script>
