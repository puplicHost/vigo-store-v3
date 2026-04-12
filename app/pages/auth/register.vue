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
    const { data, error: fetchError } = await useFetch<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        password: password.value,
        role: 'USER'
      }
    })
    
    if (fetchError.value) {
      error.value = fetchError.value.statusMessage || 'Registration failed'
      return
    }
    
    if (data.value?.success) {
      // Redirect to login
      navigateTo('/auth/login')
    }
  } catch (e) {
    error.value = 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-12">
    <!-- Header -->
    <div class="space-y-4 fade-up">
      <h2 class="text-4xl font-serif tracking-tighter text-on-surface">
        Join the Atelier
      </h2>
      <p class="text-on-surface-variant font-body text-sm leading-relaxed max-w-xs">
        Enter your details to become a member of our exclusive artisanal community.
      </p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-error-container/50 backdrop-blur-sm border border-error/20 text-error px-4 py-3 rounded text-sm fade-up">
      {{ error }}
    </div>

    <!-- Registration Form -->
    <form class="space-y-10" @submit.prevent="handleRegister">
      <div class="space-y-8">
        <!-- Name Field -->
        <div class="relative fade-up" style="animation-delay: 50ms;">
          <input
            id="full_name"
            v-model="name"
            type="text"
            required
            placeholder=" "
            class="peer w-full bg-transparent border-0 border-b-2 border-outline-variant/30 py-3 px-0 focus:ring-0 focus:border-primary transition-all duration-300 font-body text-on-surface placeholder-transparent"
          />
          <label
            for="full_name"
            class="absolute left-0 -top-3.5 text-on-surface-variant text-[10px] uppercase tracking-[0.2em] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-on-surface-variant/40 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-primary peer-focus:text-[10px] pointer-events-none"
          >
            Full Name
          </label>
        </div>

        <!-- Email Field -->
        <div class="relative fade-up" style="animation-delay: 100ms;">
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder=" "
            class="peer w-full bg-transparent border-0 border-b-2 border-outline-variant/30 py-3 px-0 focus:ring-0 focus:border-primary transition-all duration-300 font-body text-on-surface placeholder-transparent"
          />
          <label
            for="email"
            class="absolute left-0 -top-3.5 text-on-surface-variant text-[10px] uppercase tracking-[0.2em] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-on-surface-variant/40 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-primary peer-focus:text-[10px] pointer-events-none"
          >
            Email Address
          </label>
        </div>

        <!-- Password Filed -->
        <div class="relative fade-up" style="animation-delay: 150ms;">
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder=" "
            class="peer w-full bg-transparent border-0 border-b-2 border-outline-variant/30 py-3 px-0 focus:ring-0 focus:border-primary transition-all duration-300 font-body text-on-surface placeholder-transparent"
          />
          <label
            for="password"
            class="absolute left-0 -top-3.5 text-on-surface-variant text-[10px] uppercase tracking-[0.2em] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-on-surface-variant/40 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-primary peer-focus:text-[10px] pointer-events-none"
          >
            Password
          </label>
        </div>

        <!-- Confirm Password Field -->
        <div class="relative fade-up" style="animation-delay: 200ms;">
          <input
            id="confirm_password"
            v-model="confirmPassword"
            type="password"
            required
            placeholder=" "
            class="peer w-full bg-transparent border-0 border-b-2 border-outline-variant/30 py-3 px-0 focus:ring-0 focus:border-primary transition-all duration-300 font-body text-on-surface placeholder-transparent"
          />
          <label
            for="confirm_password"
            class="absolute left-0 -top-3.5 text-on-surface-variant text-[10px] uppercase tracking-[0.2em] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-on-surface-variant/40 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-primary peer-focus:text-[10px] pointer-events-none"
          >
            Confirm Password
          </label>
        </div>

        <!-- Newsletter Subscription -->
        <div class="flex items-start gap-4 pt-4 fade-up" style="animation-delay: 250ms;">
          <div class="flex items-center h-5">
            <input
              id="newsletter"
              type="checkbox"
              class="h-4 w-4 rounded-none border-outline-variant/30 text-primary focus:ring-primary/20 bg-transparent cursor-pointer"
            />
          </div>
          <div class="text-[11px]">
            <label for="newsletter" class="text-on-surface-variant/60 font-light leading-relaxed cursor-pointer hover:text-on-surface transition-colors">
              I wish to receive early access to collection drops and artisanal storytelling.
            </label>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-6 fade-up" style="animation-delay: 300ms;">
        <button
          type="submit"
          :disabled="loading"
          class="w-full btn-gradient text-on-primary font-label text-[11px] uppercase tracking-[0.3em] py-5 rounded hover:opacity-90 transition-all duration-300 shadow-xl shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          <span v-if="loading" class="material-symbols-outlined animate-spin text-lg">progress_activity</span>
          <span>{{ loading ? 'Joining...' : 'Become a Member' }}</span>
        </button>
      </div>
    </form>

    <!-- Footer Link -->
    <footer class="mt-8 text-center fade-up" style="animation-delay: 350ms;">
      <p class="text-sm text-on-surface-variant/70 font-body">
        Already registered?
        <NuxtLink to="/auth/login" class="text-primary font-semibold hover:underline underline-offset-8 ml-2 transition-all">
          Sign In
        </NuxtLink>
      </p>
    </footer>
  </div>
</template>

<style scoped>
.font-serif {
  font-family: 'Noto Serif', serif;
}
</style>
