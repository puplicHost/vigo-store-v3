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
    const { data, error: fetchError } = await useFetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })
    
    if (fetchError.value) {
      error.value = fetchError.value.statusMessage || 'Invalid credentials'
      return
    }
    
    if (data.value?.success && data.value.token) {
      // Save token and user data
      setAuth(data.value.token, {
        id: data.value.user.id,
        name: data.value.user.name,
        email: data.value.user.email,
        role: data.value.user.role
      })
      
      // Redirect to home
      navigateTo('/')
    }
  } catch (e) {
    error.value = 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-md space-y-12">
    <!-- Header & Branding -->
    <div class="text-center">
      <h1 class="text-3xl font-serif italic tracking-[0.25em] text-on-surface mb-12">
        THE ATELIER
      </h1>
      <div class="space-y-3">
        <h2 class="text-4xl font-headline tracking-tighter text-on-surface">
          Welcome Back
        </h2>
        <p class="text-on-surface-variant/80 font-body text-sm leading-relaxed max-w-xs mx-auto">
          Please enter your credentials to access your private salon.
        </p>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-error-container border border-error text-error px-4 py-3 rounded-lg text-sm text-center">
      {{ error }}
    </div>

    <!-- Login Form -->
    <form class="space-y-10" @submit.prevent="handleLogin">
      <div class="space-y-6">
        <!-- Email Input -->
        <div class="group relative">
          <label for="email" class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-1 transition-colors group-focus-within:text-primary">
            Email Address
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="atelier@example.com"
            class="w-full bg-transparent border-0 border-b border-outline-variant/30 py-3 px-0 focus:ring-0 focus:border-primary transition-all duration-300 font-body text-on-surface placeholder:text-on-surface-variant/30"
          />
        </div>

        <!-- Password Input -->
        <div class="group relative">
          <div class="flex justify-between items-end">
            <label for="password" class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-1 transition-colors group-focus-within:text-primary">
              Password
            </label>
            <a href="#" class="font-label text-[10px] uppercase tracking-[0.1em] text-on-surface-variant hover:text-primary transition-colors mb-1 underline underline-offset-4 decoration-outline-variant/30">
              Forgot?
            </a>
          </div>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full bg-transparent border-0 border-b border-outline-variant/30 py-3 px-0 focus:ring-0 focus:border-primary transition-all duration-300 font-body text-on-surface placeholder:text-on-surface-variant/30"
          />
        </div>
      </div>

      <!-- CTA Section -->
      <div class="pt-4 flex flex-col gap-6">
        <button
          type="submit"
          :disabled="loading"
          class="btn-gradient w-full py-4 px-8 rounded-lg text-on-primary font-label text-[12px] font-semibold uppercase tracking-[0.2em] shadow-lg shadow-primary/10 hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="material-symbols-outlined animate-spin text-lg">progress_activity</span>
          <span>{{ loading ? 'Signing In...' : 'Sign In' }}</span>
        </button>

        <div class="flex items-center gap-4">
          <span class="flex-grow h-[1px] bg-outline-variant/20"></span>
          <span class="font-label text-[10px] text-on-surface-variant/50 uppercase tracking-widest">or</span>
          <span class="flex-grow h-[1px] bg-outline-variant/20"></span>
        </div>

        <button
          type="button"
          class="w-full py-4 px-8 rounded-lg bg-surface border border-outline-variant/15 text-on-surface font-label text-[10px] uppercase tracking-[0.2em] hover:bg-surface-container-low transition-colors flex justify-center items-center gap-3"
        >
          <span class="material-symbols-outlined text-lg">account_circle</span>
          Continue with Google
        </button>
      </div>
    </form>

    <!-- Footer Link -->
    <div class="text-center pt-8 border-t border-outline-variant/10">
      <p class="font-body text-sm text-on-surface-variant/70">
        New to The Atelier?
        <NuxtLink to="/auth/register" class="text-primary font-semibold hover:underline underline-offset-4 ml-1">
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

.btn-gradient {
  background: linear-gradient(135deg, #775a19 0%, #c5a059 100%);
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}

input:focus {
  outline: none !important;
  box-shadow: none !important;
}
</style>
