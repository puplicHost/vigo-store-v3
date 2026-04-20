<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleForgotPassword = async () => {
  error.value = ''
  loading.value = true

  try {
    // TODO: Implement actual forgot password API call
    // For now, just simulate success
    await new Promise(resolve => setTimeout(resolve, 1000))
    success.value = true
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
        Forgot Password
      </h2>
      <p class="text-on-surface-variant font-body text-sm leading-relaxed max-w-xs">
        Enter your email address and we'll send you a link to reset your password.
      </p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-error-container/50 backdrop-blur-sm border border-error/20 text-error px-4 py-3 rounded text-sm fade-up">
      {{ error }}
    </div>

    <!-- Success Message -->
    <div v-if="success" class="bg-success/10 border border-success/30 text-success px-4 py-3 rounded text-sm fade-up">
      Password reset link has been sent to your email address.
    </div>

    <!-- Forgot Password Form -->
    <form v-if="!success" class="space-y-12" @submit.prevent="handleForgotPassword">
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
      </div>

      <!-- CTA Section -->
      <div class="space-y-6 fade-up" style="animation-delay: 200ms;">
        <button
          type="submit"
          :disabled="loading"
          class="btn-gradient w-full py-5 px-8 rounded text-on-primary font-label text-[11px] font-semibold uppercase tracking-[0.3em] shadow-xl shadow-primary/10 hover:opacity-90 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          <span v-if="loading" class="material-symbols-outlined animate-spin text-lg">progress_activity</span>
          <span>{{ loading ? 'Sending...' : 'Send Reset Link' }}</span>
        </button>
      </div>
    </form>

    <!-- Footer Link -->
    <div class="text-center pt-4 fade-up" style="animation-delay: 300ms;">
      <p class="font-body text-sm text-on-surface-variant/70">
        Remember your password?
        <NuxtLink to="/auth/login" class="text-primary font-semibold hover:underline underline-offset-8 ml-2">
          Sign In
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
