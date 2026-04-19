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
const { settings } = useSettings()
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap');

.font-body {
  font-family: 'Manrope', sans-serif;
}

@keyframes marquee {
  0% { transform: translateX(50%); }
  100% { transform: translateX(-100%); }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
}

/* Ensure navbar transition is smooth when announcement bar is present */
.fixed {
  transition: top 0.3s ease-in-out;
}
</style>
