<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

interface LoginResponse {
  success: boolean
  message: string
  token: string
  user: {
    id: string
    name: string | null
    email: string
    role: string
  }
}

const { setAuth } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  
  try {
    const data = await $apiFetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })
    
    if (data?.success && data.token) {
      // Save token and user data
      setAuth(data.token, {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role
      })

      // Redirect based on role
      const isAdmin = data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN'
      navigateTo(isAdmin ? '/admin' : '/', { replace: true })
    }
  } catch (e: any) {
    error.value = e.data?.statusMessage || 'An unexpected error occurred'
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
        Welcome Back
      </h2>
      <p class="text-on-surface-variant font-body text-sm leading-relaxed max-w-xs">
        Please enter your credentials to access your private salon.
      </p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-error-container/50 backdrop-blur-sm border border-error/20 text-error px-4 py-3 rounded text-sm fade-up">
      {{ error }}
    </div>

    <!-- Login Form -->
    <form class="space-y-12" @submit.prevent="handleLogin">
      <div class="space-y-8">
        <!-- Email Input -->
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

        <!-- Password Input -->
        <div class="relative fade-up" style="animation-delay: 200ms;">
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
          <div class="absolute right-0 top-3">
            <NuxtLink to="/auth/forgot-password" class="text-[10px] uppercase tracking-[0.1em] text-on-surface-variant/60 hover:text-primary transition-colors underline underline-offset-4 decoration-outline-variant/20">
              Forgot?
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="space-y-6 fade-up" style="animation-delay: 300ms;">
        <button
          type="submit"
          :disabled="loading"
          class="btn-gradient w-full py-5 px-8 rounded text-on-primary font-label text-[11px] font-semibold uppercase tracking-[0.3em] shadow-xl shadow-primary/10 hover:opacity-90 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          <span v-if="loading" class="material-symbols-outlined animate-spin text-lg">progress_activity</span>
          <span>{{ loading ? 'Signing In...' : 'Sign In' }}</span>
        </button>

        <div class="flex items-center gap-4 py-2">
          <span class="flex-grow h-px bg-outline-variant/10"></span>
          <span class="font-label text-[9px] text-on-surface-variant/40 uppercase tracking-[0.5em]">OR</span>
          <span class="flex-grow h-px bg-outline-variant/10"></span>
        </div>

        <button
          type="button"
          class="w-full py-4 px-8 rounded border border-outline-variant/30 text-on-surface font-label text-[10px] uppercase tracking-[0.2em] hover:bg-surface-container-low transition-all duration-300 flex justify-center items-center gap-3"
        >
          <span class="material-symbols-outlined text-lg">account_circle</span>
          Continue with Google
        </button>
      </div>
    </form>

    <!-- Footer Link -->
    <div class="text-center pt-4 fade-up" style="animation-delay: 400ms;">
      <p class="font-body text-sm text-on-surface-variant/70">
        New to The Atelier?
        <NuxtLink to="/auth/register" class="text-primary font-semibold hover:underline underline-offset-8 ml-2">
          Create an account
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.font-serif {
  font-family: 'Noto Serif', serif;
}
</style>
