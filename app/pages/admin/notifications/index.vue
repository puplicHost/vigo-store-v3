<template>
  <div class="fade-up">
    <!-- Header -->
    <div class="flex items-center justify-between mb-12">
      <div>
        <h1 class="font-serif italic text-4xl text-on-surface mb-2 tracking-tight">Atelier Alerts</h1>
        <p class="text-on-surface-variant/70 text-sm font-body uppercase tracking-[0.2em]">Notification History & Activity</p>
      </div>
      <div class="flex gap-4">
        <button 
          @click="markAllAsRead"
          class="px-6 py-3 rounded-xl border border-outline-variant/30 text-on-surface-variant font-label text-[11px] uppercase tracking-[0.15em] hover:bg-surface-container-low transition-all active:scale-95"
        >
          Mark all as read
        </button>
      </div>
    </div>

    <!-- Notification List -->
    <div class="max-w-4xl space-y-4">
      <div v-if="notifications.length === 0" class="bg-white dark:bg-surface-container rounded-3xl p-20 text-center border border-outline-variant/10">
        <div class="w-20 h-20 rounded-full bg-surface-container-low dark:bg-surface-container-high mx-auto flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-4xl text-on-surface-variant/20">notifications_off</span>
        </div>
        <h3 class="font-serif italic text-2xl text-on-surface mb-2">No activity yet</h3>
        <p class="text-on-surface-variant font-body">Your workspace is calm. All active alerts will appear here.</p>
      </div>

      <div 
        v-for="notif in notifications" 
        :key="notif.id"
        class="group bg-white dark:bg-surface-container rounded-2xl p-6 border border-outline-variant/10 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all relative overflow-hidden"
        :class="{ 'opacity-70 grayscale-[0.5]': notif.read }"
      >
        <!-- Unread Indicator Line -->
        <div v-if="!notif.read" class="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>

        <div class="flex items-start justify-between gap-6">
          <div class="flex items-start gap-5">
            <!-- Icon based on type -->
            <div 
              class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
              :class="getIconBgClass(notif.type)"
            >
              <span class="material-symbols-outlined text-2xl" :class="getIconTextClass(notif.type)">
                {{ getIconName(notif.type) }}
              </span>
            </div>

            <div>
              <div class="flex items-center gap-3 mb-1">
                <h3 class="font-serif italic text-xl text-on-surface">{{ notif.title }}</h3>
                <span v-if="!notif.read" class="px-2 py-0.5 bg-primary/10 text-primary text-[9px] uppercase font-bold tracking-widest rounded-full">New</span>
              </div>
              <p class="text-on-surface-variant font-body leading-relaxed max-w-2xl">{{ notif.message }}</p>
              <p class="text-[10px] text-on-surface-variant/40 mt-4 uppercase tracking-[0.1em] font-medium">{{ formatDate(notif.createdAt) }}</p>
            </div>
          </div>

          <div class="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              v-if="!notif.read"
              @click="markAsRead(notif.id)"
              class="p-2 rounded-lg hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-colors"
              title="Mark as read"
            >
              <span class="material-symbols-outlined text-lg">done</span>
            </button>
            <button 
              @click="removeNotification(notif.id)"
              class="p-2 rounded-lg hover:bg-error/10 text-on-surface-variant hover:text-error transition-colors"
              title="Delete"
            >
              <span class="material-symbols-outlined text-lg">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotifications()

const getIconName = (type: string) => {
  switch (type) {
    case 'success': return 'check_circle'
    case 'warning': return 'warning'
    case 'error': return 'error'
    default: return 'info'
  }
}

const getIconBgClass = (type: string) => {
  switch (type) {
    case 'success': return 'bg-success/10 text-success'
    case 'warning': return 'bg-warning/10 text-warning'
    case 'error': return 'bg-error/10 text-error'
    default: return 'bg-primary/10 text-primary'
  }
}

const getIconTextClass = (type: string) => {
  switch (type) {
    case 'success': return 'text-success'
    case 'warning': return 'text-warning'
    case 'error': return 'text-error'
    default: return 'text-primary'
  }
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}
</script>
