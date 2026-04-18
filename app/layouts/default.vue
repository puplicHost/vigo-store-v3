<template>
  <div class="min-h-screen bg-surface text-on-surface font-body flex flex-col">
    <StorefrontTheNavbar />
    <div class="flex-grow">
      <NuxtPage />
    </div>
    <StorefrontTheFooter />
  </div>
</template>

<script setup>
// Since we are in Nuxt 3/4, components in app/components/storefront/ 
// are automatically available as <StorefrontTheNavbar />
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap');

.font-body {
  font-family: 'Manrope', sans-serif;
}
</style>
