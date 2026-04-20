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
</script>

<style>
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
