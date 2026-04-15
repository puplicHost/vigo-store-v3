export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: Date
}

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
      createdAt: new Date(),
    }
    notifications.value.unshift(newNotification)
    
    // Auto-remove after 5 seconds if it's a success/info toast
    if (newNotification.type === 'success' || newNotification.type === 'info') {
        setTimeout(() => {
            removeNotification(newNotification.id)
        }, 5000)
    }
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

  // Toast-specific helpers
  const toast = {
    success: (message: string, title?: string) => addNotification({ type: 'success', message, title: title || 'Success' }),
    error: (message: string, title?: string) => addNotification({ type: 'error', message, title: title || 'Error' }),
    info: (message: string, title?: string) => addNotification({ type: 'info', message, title: title || 'Info' }),
    warning: (message: string, title?: string) => addNotification({ type: 'warning', message, title: title || 'Warning' }),
  }

  return {
    notifications: readonly(notifications),
    hasUnread,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    toast
  }
}
