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

const { setAuth, logout } = useAuth()
const { settings } = useSettings()

// If already authenticated, redirect away
onMounted(() => {
  const auth = useAuth()
  if (auth.isAuthenticated.value) {
    const isAdmin = auth.user.value?.role === 'ADMIN' || auth.user.value?.role === 'SUPER_ADMIN'
    navigateTo(isAdmin ? '/admin' : '/', { replace: true })
  }
})

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
  <div class="w-full space-y-16 animate-stagger">
    <!-- Header -->
    <div class="space-y-6 text-center">
      <h2 class="text-5xl font-serif tracking-tight text-on-surface italic">
        Welcome Back
      </h2>
      <p class="text-stone-600 font-body text-sm leading-relaxed max-w-xs mx-auto italic font-medium">
        Please enter your credentials to access your private salon.
      </p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest text-center">
      {{ error }}
    </div>

    <!-- Login Form -->
    <form class="space-y-12" @submit.prevent="handleLogin">
      <div class="space-y-10">
        <!-- Email Input -->
        <div class="relative group">
          <label
            for="email"
            class="block text-[10px] uppercase tracking-[0.3em] text-stone-600 font-bold mb-2 group-focus-within:text-primary transition-colors"
          >
            Email Address
          </label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-primary transition-colors">email</span>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="atelier@example.com"
              class="w-full bg-transparent border-0 border-b border-stone-200 py-3 pl-10 pr-0 focus:ring-0 focus:border-primary transition-all duration-500 font-body text-on-surface placeholder:text-stone-200"
            />
          </div>
        </div>

        <!-- Password Input -->
        <div class="relative group">
          <div class="flex justify-between items-center mb-2">
            <label
              for="password"
              class="block text-[10px] uppercase tracking-[0.3em] text-stone-600 font-bold group-focus-within:text-primary transition-colors"
            >
              Password
            </label>
            <NuxtLink to="/auth/forgot-password" class="text-[9px] uppercase tracking-[0.2em] text-stone-500 hover:text-primary transition-colors font-bold border-b border-stone-100 pb-0.5">
              Forgot?
            </NuxtLink>
          </div>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-primary transition-colors">lock</span>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full bg-transparent border-0 border-b border-stone-200 py-3 pl-10 pr-0 focus:ring-0 focus:border-primary transition-all duration-500 font-body text-on-surface placeholder:text-stone-200"
            />
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="space-y-8">
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-6 px-10 bg-primary text-white rounded-full font-label text-[11px] font-bold uppercase tracking-[0.4em] shadow-2xl shadow-primary/20 hover:bg-stone-900 transition-all duration-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span v-if="loading" class="material-symbols-outlined animate-spin text-lg italic">progress_activity</span>
          <span>{{ loading ? 'Authenticating...' : 'Sign In' }}</span>
        </button>

        <div class="flex items-center gap-6 py-2">
          <span class="flex-grow h-px bg-stone-100"></span>
          <span class="font-label text-[9px] text-stone-300 uppercase tracking-[0.5em] font-bold">OR</span>
          <span class="flex-grow h-px bg-stone-100"></span>
        </div>

        <button
          type="button"
          class="w-full py-5 px-10 rounded-full border border-stone-100 text-stone-600 font-label text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-stone-50 transition-all duration-500 flex justify-center items-center gap-4 active:scale-95"
        >
          <span class="mdi mdi-google text-lg text-primary"></span>
          Continue with Google
        </button>
      </div>
    </form>

    <!-- Footer Link -->
    <div class="text-center pt-8 border-t border-stone-100">
      <p class="font-body text-sm text-stone-400 italic">
        New to {{ settings?.siteName || 'The Atelier' }}?
        <NuxtLink to="/auth/register" class="text-primary font-bold hover:text-stone-900 transition-colors ml-2 not-italic uppercase tracking-widest text-[10px]">
          Create an account
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
