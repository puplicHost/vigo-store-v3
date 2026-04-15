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
        :class="[
          'p-4 rounded-xl shadow-2xl border flex items-start gap-4 backdrop-blur-md',
          notif.type === 'success' ? 'bg-success/90 border-success/20 text-white' :
          notif.type === 'error' ? 'bg-error/90 border-error/20 text-white' :
          notif.type === 'warning' ? 'bg-warning/90 border-warning/20 text-white' :
          'bg-primary/90 border-primary/20 text-white'
        ]"
      >
        <span class="material-symbols-outlined mt-0.5">
          {{ 
            notif.type === 'success' ? 'check_circle' : 
            notif.type === 'error' ? 'error' : 
            notif.type === 'warning' ? 'warning' : 'info' 
          }}
        </span>
        <div class="flex-1">
          <p class="font-bold text-sm mb-0.5">{{ notif.title }}</p>
          <p class="text-xs opacity-90 font-body">{{ notif.message }}</p>
        </div>
        <button @click="removeNotification(notif.id)" class="opacity-70 hover:opacity-100 transition-opacity">
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
const { notifications, removeNotification } = useNotifications()
</script>
