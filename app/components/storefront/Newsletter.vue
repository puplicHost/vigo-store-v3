<template>
  <section class="py-24 bg-stone-900 overflow-hidden relative">
    <!-- Abstract Background Element -->
    <div class="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

    <div class="max-w-screen-xl mx-auto px-12 relative z-10">
      <div class="flex flex-col md:flex-row items-center gap-16">
        <div class="w-full md:w-1/2">
          <span class="uppercase tracking-[0.4em] text-[9px] font-bold text-primary mb-6 block">The Atelier Dispatch</span>
          <h2 class="text-4xl md:text-6xl font-serif text-white leading-tight mb-8">
            Stay ahead of <br/><span class="italic text-primary">The Curve</span>
          </h2>
          <p class="text-stone-400 font-body text-base max-w-sm leading-relaxed">
            Subscribe to our newsletter and be the first to receive exclusive previews of upcoming collections, editorial insights, and private event invitations.
          </p>
        </div>

        <div class="w-full md:w-1/2">
          <form @submit.prevent="handleSubscribe" class="flex flex-col gap-4">
            <div class="relative group">
              <input 
                v-model="email"
                type="email" 
                required
                placeholder="yours@example.com"
                class="w-full bg-white/5 border-b border-white/20 py-6 px-0 text-white font-body placeholder:text-stone-600 focus:outline-none focus:border-primary transition-all duration-500"
              />
              <button 
                type="submit" 
                :disabled="loading"
                class="absolute right-0 bottom-6 group-hover:text-primary transition-colors disabled:opacity-50"
              >
                <span class="material-symbols-outlined text-3xl">arrow_forward</span>
              </button>
            </div>
            <p v-if="success" class="text-primary text-xs font-label uppercase tracking-widest animate-fade-in">
              Welcome to the inner circle.
            </p>
            <p v-if="error" class="text-red-400 text-xs font-label uppercase tracking-widest">
              Please provide a valid address.
            </p>
            <p class="text-[10px] text-stone-500 uppercase tracking-widest mt-4">
              By subscribing, you agree to our <NuxtLink to="/privacy" class="underline underline-offset-4">Privacy Policy</NuxtLink>.
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const email = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref(false)

const handleSubscribe = async () => {
  if (!email.value) return
  
  loading.value = true
  error.value = false
  
  // Simulate API call for now
  setTimeout(() => {
    loading.value = false
    success.value = true
    email.value = ''
    setTimeout(() => { success.value = false }, 5000)
  }, 1500)
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
</style>
