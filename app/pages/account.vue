<template>
  <div class="min-h-screen bg-white text-stone-900 selection:bg-primary/10">
    <main class="pt-40 pb-32 px-6 md:px-12 max-w-screen-2xl mx-auto">
      <div v-if="pending" class="flex flex-col justify-center items-center py-40 gap-8">
        <div class="w-16 h-16 border-2 border-stone-100 border-t-primary rounded-full animate-spin"></div>
        <p class="text-[10px] uppercase tracking-[0.6em] text-stone-300 font-bold italic animate-pulse">Syncing Intel...</p>
      </div>
      
      <div v-else-if="!isAuthenticated" class="text-center py-40 border border-dashed border-stone-100 rounded-[4rem] bg-stone-50/50">
        <h2 class="text-5xl font-serif mb-8 italic tracking-tight font-bold">Unrecognized Identity</h2>
        <p class="text-stone-400 mb-12 italic font-body text-lg max-w-md mx-auto">Please confirm your credentials to access your individual curated archive.</p>
        <NuxtLink to="/auth/login" class="px-16 py-6 bg-stone-900 text-white rounded-full font-label uppercase tracking-[0.4em] text-[10px] font-bold hover:bg-primary transition-all shadow-2xl shadow-stone-900/10">Proceed to Login</NuxtLink>
      </div>

      <div v-else class="max-w-6xl mx-auto space-y-24">
        <!-- Dashboard Header -->
        <header class="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-stone-100 pb-16">
          <div class="space-y-6">
            <span class="text-[10px] uppercase tracking-[0.6em] text-primary font-bold italic">Dashboard Archive</span>
            <h1 class="text-6xl md:text-8xl font-serif italic text-stone-900 tracking-tight font-bold leading-none">Welcome back, <br/><span class="text-primary">{{ user?.name?.split(' ')[0] || 'Member' }}</span></h1>
          </div>
          <div class="flex items-center gap-6 pb-2">
             <div class="w-16 h-16 rounded-full border-2 border-primary/20 flex items-center justify-center p-1">
                <div class="w-full h-full rounded-full bg-primary text-white flex items-center justify-center font-serif text-2xl italic font-bold">
                   {{ user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() }}
                </div>
             </div>
             <div class="text-right">
                <p class="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-bold italic">Tier Status</p>
                <p class="text-sm font-bold uppercase tracking-widest text-stone-900">Atelier {{ user?.role || 'Member' }}</p>
             </div>
          </div>
        </header>

        <div class="flex flex-col lg:flex-row gap-20 xl:gap-32">
          
          <!-- Editorial Sidebar -->
          <aside class="w-full lg:w-72 flex-shrink-0">
            <div class="sticky top-40 space-y-12 animate-stagger">
              <nav class="flex flex-col gap-4">
                <NuxtLink to="/account" class="p-6 bg-stone-50 border border-stone-100 text-primary rounded-3xl font-bold text-[10px] uppercase tracking-[0.4em] flex items-center justify-between group transition-all italic">
                  Profile Overview
                  <span class="material-symbols-outlined text-sm italic group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </NuxtLink>
                <NuxtLink to="#" class="p-6 text-stone-300 hover:text-stone-900 border border-transparent hover:border-stone-100 rounded-3xl font-bold text-[10px] uppercase tracking-[0.4em] flex items-center justify-between group transition-all italic">
                  Order Narrative
                  <span class="material-symbols-outlined text-sm italic opacity-0 group-hover:opacity-100 transition-opacity">receipt_long</span>
                </NuxtLink>
                <NuxtLink to="#" class="p-6 text-stone-300 hover:text-stone-900 border border-transparent hover:border-stone-100 rounded-3xl font-bold text-[10px] uppercase tracking-[0.4em] flex items-center justify-between group transition-all italic">
                  Silhouette Wishlist
                  <span class="material-symbols-outlined text-sm italic opacity-0 group-hover:opacity-100 transition-opacity">favorite</span>
                </NuxtLink>
                
                <div class="pt-10 border-t border-stone-50 mt-6">
                  <button @click="handleLogout" class="p-6 w-full text-red-400 hover:text-red-600 hover:bg-red-50 rounded-3xl font-bold text-[10px] uppercase tracking-[0.4em] flex items-center justify-between group transition-all italic text-left">
                    Logout of Session
                    <span class="material-symbols-outlined text-sm italic">logout</span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          <!-- Main Detail Display -->
          <div class="flex-1 space-y-24">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
              <!-- Personal Intelligence -->
              <div class="card-premium p-12 rounded-[3.5rem] bg-stone-50/30 border border-stone-100 space-y-8 flex flex-col justify-between group">
                <div class="space-y-6">
                  <span class="text-[9px] uppercase tracking-[0.6em] text-stone-300 font-bold italic">Identity Repository</span>
                  <div class="space-y-2">
                    <h3 class="font-serif text-3xl font-bold italic text-stone-900 tracking-tight">{{ user?.name || 'Incomplete Profile' }}</h3>
                    <p class="text-sm text-stone-400 italic font-body">{{ user?.email }}</p>
                  </div>
                </div>
                <button class="text-primary text-[9px] uppercase tracking-[0.4em] font-bold italic border-b border-primary/20 pb-2 hover:border-primary transition-all w-max w-full text-left">Refine Credentials</button>
              </div>

              <!-- Address Archive -->
              <div class="card-premium p-12 rounded-[3.5rem] bg-stone-50/30 border border-stone-100 space-y-8 flex flex-col justify-between group">
                <div class="space-y-6">
                  <span class="text-[9px] uppercase tracking-[0.6em] text-stone-300 font-bold italic">Logistical Archive</span>
                  <p class="text-sm text-stone-300 font-body italic leading-relaxed">No delivery coordinates found in our current archives. Please designate a default location.</p>
                </div>
                <button class="text-primary text-[9px] uppercase tracking-[0.4em] font-bold italic border-b border-primary/20 pb-2 hover:border-primary transition-all w-max w-full text-left">Designate Address</button>
              </div>
            </div>

            <div class="space-y-12">
              <div class="flex items-center justify-between border-b border-stone-100 pb-8">
                <h2 class="text-3xl md:text-5xl font-serif italic text-stone-900 tracking-tight font-bold">Recent Acquisitions</h2>
                <span class="text-[10px] uppercase tracking-[0.4em] text-stone-300 font-bold italic">Latest 05</span>
              </div>
              
              <div class="py-24 text-center border-2 border-dashed border-stone-50 rounded-[4rem] group hover:border-stone-100 transition-all duration-700">
                <div class="relative w-max mx-auto mb-10">
                  <span class="material-symbols-outlined text-7xl text-stone-100 font-light italic">shelf_position</span>
                  <div class="absolute inset-x-0 bottom-0 h-px bg-primary/20 scale-x-0 group-hover:scale-x-150 transition-transform duration-1000"></div>
                </div>
                <p class="text-stone-300 font-serif italic text-2xl tracking-tight max-w-sm mx-auto">Your acquisition history is currently an unwritten narrative.</p>
                <NuxtLink to="/products" class="inline-block mt-12 text-[10px] font-bold uppercase tracking-[0.5em] text-primary border-b border-primary/20 pb-2 hover:border-primary transition-all hover:translate-x-4 duration-700 italic">Initiate Portfolio Selection</NuxtLink>
              </div>
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
