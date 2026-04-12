<script setup lang="ts">
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
  <div class="w-full max-w-4xl flex flex-col items-center">
    <!-- Centered Editorial Intro -->
    <div class="text-center mb-16 max-w-2xl">
      <p class="font-label text-[10px] uppercase tracking-[0.4em] mb-6 text-primary">
        Est. 2024 — Membership
      </p>
      <h2 class="font-headline text-5xl md:text-6xl italic mb-8 leading-tight">
        The essence of bespoke curation.
      </h2>
      <div class="h-px w-24 bg-primary/30 mx-auto mb-8"></div>
      <p class="text-base text-on-surface-variant font-light leading-relaxed px-4">
        Join Elixir and unlock exclusive access to the Atelier's limited editions,
        artisanal releases, and seasonal scent journals.
      </p>
    </div>

    <!-- Centered Registration Form -->
    <div class="w-full max-w-lg bg-white/40 dark:bg-black/5 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-outline-variant/10 shadow-2xl shadow-primary/5">
      <header class="mb-10 text-center">
        <h1 class="font-headline text-3xl tracking-tighter mb-2">Create Account</h1>
        <p class="text-on-surface-variant text-sm font-light">
          Enter your details to join the ELIXIR community.
        </p>
      </header>

      <!-- Error Message -->
      <div v-if="error" class="bg-error-container border border-error text-error px-4 py-3 rounded-lg text-sm text-center mb-6">
        {{ error }}
      </div>

      <form class="space-y-6" @submit.prevent="handleRegister">
        <!-- Name Field -->
        <div class="relative">
          <label for="full_name" class="block font-label text-[9px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">
            Full Name
          </label>
          <input
            id="full_name"
            v-model="name"
            type="text"
            placeholder="Alexander Sterling"
            class="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 py-3 text-sm focus:border-primary transition-colors duration-300"
          />
        </div>

        <!-- Email Field -->
        <div class="relative">
          <label for="email" class="block font-label text-[9px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">
            Email Address
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="alexander@atelier.com"
            class="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 py-3 text-sm focus:border-primary transition-colors duration-300"
          />
        </div>

        <!-- Password Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="relative">
            <label for="password" class="block font-label text-[9px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 py-3 text-sm focus:border-primary transition-colors duration-300"
            />
          </div>
          <div class="relative">
            <label for="confirm_password" class="block font-label text-[9px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">
              Confirm
            </label>
            <input
              id="confirm_password"
              v-model="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              class="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 py-3 text-sm focus:border-primary transition-colors duration-300"
            />
          </div>
        </div>

        <!-- Newsletter Subscription -->
        <div class="flex items-start gap-4 pt-4">
          <div class="flex items-center h-5">
            <input
              id="newsletter"
              type="checkbox"
              class="h-4 w-4 rounded-none border-outline-variant text-primary focus:ring-primary/20 bg-transparent"
            />
          </div>
          <div class="text-[11px]">
            <label for="newsletter" class="text-on-surface-variant font-light leading-relaxed">
              Subscribe to our newsletter for early access to collection drops and artisanal storytelling.
            </label>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-6">
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-luxury text-on-primary font-label text-[11px] uppercase tracking-[0.25em] py-5 rounded-md hover:opacity-90 transition-opacity duration-300 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="material-symbols-outlined animate-spin text-lg">progress_activity</span>
            <span>{{ loading ? 'Joining...' : 'Join the Atelier' }}</span>
          </button>
        </div>
      </form>

      <!-- Footer Link -->
      <footer class="mt-10 text-center">
        <p class="text-[11px] text-on-surface-variant font-light">
          Already have an account?
          <NuxtLink to="/auth/login" class="text-primary font-medium hover:underline underline-offset-4 ml-1 transition-all">
            Sign In
          </NuxtLink>
        </p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Noto Serif', serif;
}

.font-serif {
  font-family: 'Noto Serif', serif;
}

.btn-luxury {
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
