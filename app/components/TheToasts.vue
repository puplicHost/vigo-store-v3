<template>
  <div class="fixed top-8 right-8 z-[100] flex flex-col gap-3 w-80">
    <TransitionGroup 
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-x-full opacity-0"
      enter-to-class="transform translate-x-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-x-0 opacity-100"
      leave-to-class="transform translate-x-full opacity-0"
    >
      <div 
        v-for="notif in notifications" 
        :key="notif.id"
        class="relative p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-start gap-4 backdrop-blur-xl transition-all duration-300 bg-white/95 dark:bg-surface-container-lowest border border-outline-variant/20 dark:border-outline-variant/10 hover:shadow-2xl hover:scale-[1.02] overflow-hidden group"
      >
        <!-- Left color accent -->
        <div :class="[
          'absolute left-0 top-0 bottom-0 w-1 opacity-80 group-hover:opacity-100 transition-opacity',
          notif.type === 'success' ? 'bg-success' : 
          notif.type === 'error' ? 'bg-error' : 
          notif.type === 'warning' ? 'bg-warning' : 'bg-primary'
        ]"></div>

        <div :class="[
          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-opacity-10 dark:bg-opacity-20',
          notif.type === 'success' ? 'bg-success text-success' : 
          notif.type === 'error' ? 'bg-error text-error' : 
          notif.type === 'warning' ? 'bg-warning text-warning' : 'bg-primary text-primary'
        ]">
          <span class="material-symbols-outlined text-xl">
            {{ 
              notif.type === 'success' ? 'check_circle' : 
              notif.type === 'error' ? 'error' : 
              notif.type === 'warning' ? 'warning' : 'info' 
            }}
          </span>
        </div>
        
        <div class="flex-1 min-w-0 py-0.5">
          <p :class="[
            'font-bold text-sm mb-1 line-clamp-1',
            notif.type === 'success' ? 'text-success' : 
            notif.type === 'error' ? 'text-error' : 
            notif.type === 'warning' ? 'text-warning' : 'text-primary'
          ]">{{ notif.title }}</p>
          <p class="text-xs text-on-surface-variant font-body line-clamp-2 leading-relaxed">{{ notif.message }}</p>
        </div>
        
        <button @click="removeNotification(notif.id)" class="text-on-surface-variant/50 hover:text-error hover:bg-error/10 p-1.5 rounded-lg transition-colors flex-shrink-0">
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
const { notifications, removeNotification } = useNotifications()
</script>
