<template>
  <div class="min-h-screen bg-surface text-on-surface">
    <main class="pt-32 pb-24 px-6 md:px-12 max-w-screen-xl mx-auto">
      <div v-if="pending" class="flex justify-center items-center py-20">
        <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
      <div v-else-if="!isAuthenticated" class="text-center py-20">
        <h2 class="text-2xl font-serif mb-4">Not Authenticated</h2>
        <p class="text-secondary mb-6">Please log in to view your account.</p>
        <NuxtLink to="/auth/login" class="px-6 py-3 bg-primary text-on-primary rounded font-label uppercase tracking-widest text-xs">Log In</NuxtLink>
      </div>
      <div v-else class="max-w-4xl mx-auto">
        <div class="flex flex-col md:flex-row gap-12">
          
          <!-- Sidebar -->
          <div class="w-full md:w-1/4">
            <div class="bg-surface-container-low p-6 rounded-2xl sticky top-32">
              <div class="flex items-center gap-4 mb-8">
                <div class="w-12 h-12 rounded-full bg-primary-soft flex items-center justify-center text-primary-solid font-serif text-xl border border-primary/10">
                  {{ user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U' }}
                </div>
                <div>
                  <p class="font-semibold text-sm truncate max-w-[120px]">{{ user?.name || 'Customer' }}</p>
                  <p class="text-xs text-secondary capitalize">{{ user?.role?.toLowerCase() || 'User' }}</p>
                </div>
              </div>

              <nav class="flex flex-col gap-2">
                <NuxtLink to="/account" class="p-3 bg-primary/5 text-primary rounded-lg font-medium text-sm flex items-center gap-3">
                  <span class="material-symbols-outlined text-lg">person</span>
                  Profile
                </NuxtLink>
                <NuxtLink to="#" class="p-3 text-secondary hover:bg-surface-container hover:text-on-surface rounded-lg font-medium text-sm flex items-center gap-3 transition-colors">
                  <span class="material-symbols-outlined text-lg">inventory_2</span>
                  Orders
                </NuxtLink>
                <NuxtLink to="#" class="p-3 text-secondary hover:bg-surface-container hover:text-on-surface rounded-lg font-medium text-sm flex items-center gap-3 transition-colors">
                  <span class="material-symbols-outlined text-lg">favorite</span>
                  Wishlist
                </NuxtLink>
                <button @click="handleLogout" class="p-3 text-error hover:bg-error-soft rounded-lg font-medium text-sm flex items-center gap-3 transition-colors text-left w-full mt-4">
                  <span class="material-symbols-outlined text-lg">logout</span>
                  Sign Out
                </button>
              </nav>
            </div>
          </div>

          <!-- Main Content -->
          <div class="w-full md:w-3/4">
            <h1 class="text-4xl font-serif mb-8 text-on-surface tracking-tight">Account Overview</h1>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <!-- Personal Details -->
              <div class="card-premium p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 class="text-xs uppercase tracking-widest text-secondary font-label mb-4">Personal Details</h3>
                  <p class="font-serif text-xl mb-1">{{ user?.name || 'Not Provided' }}</p>
                  <p class="text-secondary font-body">{{ user?.email }}</p>
                </div>
                <button class="text-primary text-xs uppercase tracking-widest font-label hover:underline underline-offset-4 w-max mt-6">Edit Detials</button>
              </div>

              <!-- Address Book -->
              <div class="card-premium p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 class="text-xs uppercase tracking-widest text-secondary font-label mb-4">Default Address</h3>
                  <p class="text-secondary font-body">You have no saved addresses yet.</p>
                </div>
                <button class="text-primary text-xs uppercase tracking-widest font-label hover:underline underline-offset-4 w-max mt-6">Add Address</button>
              </div>
            </div>

            <h2 class="text-2xl font-serif mb-6 text-on-surface tracking-tight">Recent Orders</h2>
            <div class="card-premium p-10 rounded-2xl text-center">
              <span class="material-symbols-outlined text-4xl text-outline-variant mb-4">receipt_long</span>
              <p class="text-secondary font-body">You haven't placed any orders recently.</p>
              <NuxtLink to="/products" class="inline-block mt-6 px-6 py-2 border border-primary text-primary rounded-lg font-label uppercase tracking-widest text-xs hover:bg-primary/5 transition-colors">Start Shopping</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated, user, logout } = useAuth()
const { settings } = useSettings()
const pending = ref(false)

definePageMeta({
  middleware: 'auth' // Protect this route
})

useHead({
  title: 'My Account'
})

const handleLogout = () => {
  if (confirm('Are you sure you want to sign out?')) {
    logout()
  }
}
</script>
