<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})
interface RegisterResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    name: string | null
    role: string
  }
}

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  error.value = ''
  
  // Validation
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  
  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }
  
  loading.value = true
  
  try {
    const data = await $apiFetch<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        password: password.value,
        role: 'USER'
      }
    })
    
    if (data?.success) {
      // Redirect to login
      navigateTo('/auth/login', { replace: true })
    }
  } catch (e: any) {
    error.value = e.data?.statusMessage || 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto space-y-20 animate-stagger mb-20">
    <!-- Hero Section -->
    <div class="text-center space-y-8">
      <span class="text-[10px] uppercase tracking-[0.6em] text-stone-600 font-bold block">Est. 2024 — Membership</span>
      <h2 class="text-5xl md:text-7xl font-serif tracking-tight text-on-surface leading-tight">
        The essence of <br/><span class="italic text-primary">bespoke curation.</span>
      </h2>
      <div class="w-24 h-px bg-stone-100 mx-auto"></div>
      <p class="text-stone-600 font-body text-sm leading-relaxed max-w-sm mx-auto italic">
        Join {{ settings?.siteName || 'Elixir' }} and unlock exclusive access to the Atelier's limited editions, artisanal releases, and seasonal scent journals.
      </p>
    </div>

    <!-- Main Registration Box -->
    <div class="bg-stone-50/40 p-10 md:p-16 rounded-[2.5rem] border border-stone-100 shadow-sm">
      <div class="text-center mb-16">
         <h3 class="text-3xl font-serif text-stone-900 mb-4 italic">Create Account</h3>
         <p class="text-[10px] uppercase tracking-widest text-stone-600 font-bold">Enter your details to join the {{ settings?.siteName || 'ELIXIR' }} community.</p>
      </div>

       <!-- Error Message -->
      <div v-if="error" class="mb-12 bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest text-center">
        {{ error }}
      </div>

      <!-- Registration Form -->
      <form class="space-y-12" @submit.prevent="handleRegister">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <!-- Name Field -->
          <div class="relative group md:col-span-2">
            <label for="full_name" class="block text-[10px] uppercase tracking-[0.3em] text-stone-600 font-bold mb-2 group-focus-within:text-primary transition-colors">Full Name</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-primary transition-colors">person</span>
              <input id="full_name" v-model="name" type="text" required placeholder="Alexander Sterling" class="w-full bg-transparent border-0 border-b border-stone-200 py-3 pl-10 pr-0 focus:ring-0 focus:border-primary transition-all duration-500 font-body text-on-surface placeholder:text-stone-200"/>
            </div>
          </div>

          <!-- Email Field -->
          <div class="relative group md:col-span-2">
            <label for="email" class="block text-[10px] uppercase tracking-[0.3em] text-stone-600 font-bold mb-2 group-focus-within:text-primary transition-colors">Email Address</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-primary transition-colors">email</span>
              <input id="email" v-model="email" type="email" required placeholder="alexander@atelier.com" class="w-full bg-transparent border-0 border-b border-stone-200 py-3 pl-10 pr-0 focus:ring-0 focus:border-primary transition-all duration-500 font-body text-on-surface placeholder:text-stone-200"/>
            </div>
          </div>

          <!-- Password Filed -->
          <div class="relative group">
            <label for="password" class="block text-[10px] uppercase tracking-[0.3em] text-stone-600 font-bold mb-2 group-focus-within:text-primary transition-colors">Password</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-primary transition-colors">lock</span>
              <input id="password" v-model="password" type="password" required placeholder="••••••••" class="w-full bg-transparent border-0 border-b border-stone-200 py-3 pl-10 pr-0 focus:ring-0 focus:border-primary transition-all duration-500 font-body text-on-surface placeholder:text-stone-200"/>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div class="relative group">
            <label for="confirm_password" class="block text-[10px] uppercase tracking-[0.3em] text-stone-600 font-bold mb-2 group-focus-within:text-primary transition-colors">Confirm</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-primary transition-colors">verified_user</span>
              <input id="confirm_password" v-model="confirmPassword" type="password" required placeholder="••••••••" class="w-full bg-transparent border-0 border-b border-stone-200 py-3 pl-10 pr-0 focus:ring-0 focus:border-primary transition-all duration-500 font-body text-on-surface placeholder:text-stone-200"/>
            </div>
          </div>

          <!-- Newsletter Subscription -->
          <div class="md:col-span-2 flex items-start gap-4 pt-4 group">
            <input id="newsletter" type="checkbox" class="mt-1 h-4 w-4 rounded-none border-stone-200 text-primary focus:ring-primary/20 bg-transparent cursor-pointer transition-all"/>
            <label for="newsletter" class="text-[11px] text-stone-600 font-medium leading-relaxed cursor-pointer group-hover:text-stone-900 transition-colors italic">
              Subscribe to our newsletter for early access to collection drops and artisanal storytelling.
            </label>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-8">
          <button type="submit" :disabled="loading" class="w-full py-7 px-10 bg-primary text-white rounded-full font-label text-[11px] font-bold uppercase tracking-[0.4em] shadow-3xl shadow-primary/30 hover:bg-stone-900 transition-all duration-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98]">
            <span v-if="loading" class="material-symbols-outlined animate-spin text-lg italic">progress_activity</span>
            <span>{{ loading ? 'Securing Membership...' : 'Join The Atelier' }}</span>
          </button>
        </div>
      </form>

       <!-- Footer Link -->
      <div class="mt-12 text-center">
        <p class="text-xs text-stone-400 font-body italic flex items-center justify-center gap-2">
          Already have an account?
          <NuxtLink to="/auth/login" class="text-primary font-bold not-italic hover:text-stone-900 transition-colors uppercase tracking-widest text-[9px]">
            Sign In
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
