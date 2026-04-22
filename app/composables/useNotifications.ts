export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  persist: boolean // true = persistent notification, false = toast (temporary)
  createdAt: Date
}

const MAX_NOTIFICATIONS = 20
const TOAST_AUTO_DISMISS_MS = 3000

export const useNotifications = () => {
  const notifications = useState<Notification[]>('notifications_list', () => [])
  const hasUnread = computed(() => notifications.value.some(n => !n.read))

  const addNotification = (notif: Partial<Notification>) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substring(7),
      title: notif.title || 'New Notification',
      message: notif.message || '',
      type: notif.type || 'info',
      read: false,
      persist: notif.persist !== undefined ? notif.persist : false,
      createdAt: new Date(),
    }
    
    // Add to beginning
    notifications.value.unshift(newNotification)
    
    // Cap at max notifications
    if (notifications.value.length > MAX_NOTIFICATIONS) {
      notifications.value = notifications.value.slice(0, MAX_NOTIFICATIONS)
    }
    
    // Auto-dismiss toasts
    if (!newNotification.persist) {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, TOAST_AUTO_DISMISS_MS)
    }
    
    return newNotification.id
  }

  const markAsRead = (id: string) => {
    const notif = notifications.value.find(n => n.id === id)
    if (notif) notif.read = true
  }

  const markAllAsRead = () => {
    notifications.value.forEach(n => n.read = true)
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) notifications.value.splice(index, 1)
  }

  // Toast-specific helpers (temporary, auto-dismissing)
  const toast = {
    success: (message: string, title?: string) => addNotification({ 
      type: 'success', 
      message, 
      title: title || 'Success',
      persist: false 
    }),
    error: (message: string, title?: string) => addNotification({ 
      type: 'error', 
      message, 
      title: title || 'Error',
      persist: false 
    }),
    info: (message: string, title?: string) => addNotification({ 
      type: 'info', 
      message, 
      title: title || 'Info',
      persist: false 
    }),
    warning: (message: string, title?: string) => addNotification({ 
      type: 'warning', 
      message, 
      title: title || 'Warning',
      persist: false 
    }),
  }

  // Persistent notification helpers (saved to notification center)
  const notify = {
    success: (message: string, title?: string) => addNotification({ 
      type: 'success', 
      message, 
      title: title || 'Success',
      persist: true 
    }),
    error: (message: string, title?: string) => addNotification({ 
      type: 'error', 
      message, 
      title: title || 'Error',
      persist: true 
    }),
    info: (message: string, title?: string) => addNotification({ 
      type: 'info', 
      message, 
      title: title || 'Info',
      persist: true 
    }),
    warning: (message: string, title?: string) => addNotification({ 
      type: 'warning', 
      message, 
      title: title || 'Warning',
      persist: true 
    }),
  }

  return {
    notifications: readonly(notifications),
    hasUnread,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    toast,
    notify
  }
}
