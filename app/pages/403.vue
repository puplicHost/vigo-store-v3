<template>
  <div class="min-h-screen bg-gradient-to-br from-surface to-surface-container-high flex items-center justify-center p-4">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <div class="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-error/20 to-error/5 flex items-center justify-center">
          <span class="material-symbols-outlined text-6xl text-error">block</span>
        </div>
        <h1 class="font-serif italic text-6xl text-error mb-4">403</h1>
        <h2 class="font-serif italic text-2xl text-on-surface mb-2">Access Denied</h2>
        <p class="text-on-surface-variant font-body">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
      </div>

      <div class="space-y-4">
        <NuxtLink
          to="/admin/dashboard"
          class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-label text-[11px] uppercase tracking-[0.2em] hover:bg-primary/90 transition-colors"
        >
          <span class="material-symbols-outlined text-lg">dashboard</span>
          Go to Dashboard
        </NuxtLink>

        <div>
          <button
            @click="logout"
            class="inline-flex items-center gap-2 px-6 py-3 border border-outline-variant/30 text-on-surface-variant rounded-lg font-label text-[11px] uppercase tracking-[0.2em] hover:bg-surface-container-low transition-colors"
          >
            <span class="material-symbols-outlined text-lg">logout</span>
            Logout
          </button>
        </div>
      </div>

      <div class="mt-12 pt-8 border-t border-outline-variant/10">
        <p class="text-xs text-on-surface-variant/60 font-body">
          Error Code: 403 Forbidden
        </p>
        <p class="text-xs text-on-surface-variant/60 font-body mt-1">
          {{ new Date().toLocaleString() }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const auth = useAuth()

const logout = async () => {
  await auth.logout()
  navigateTo('/login', { replace: true })
}
</script>
