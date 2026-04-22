export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    const router = useRouter()
    const navigationHistory: string[] = []
    let redirectCount = 0
    let lastRedirectTime = 0

    // Global route tracking with loop detection
    router.beforeEach((to, from) => {
      const now = Date.now()
      const timeSinceLastRedirect = now - lastRedirectTime

      // Detect rapid redirects (potential loop)
      if (timeSinceLastRedirect < 1000) {
        redirectCount++
        console.warn(`[ROUTE] Rapid redirect detected! Count: ${redirectCount}, Path: ${to.path}`)

        if (redirectCount >= 3) {
          console.error('[ROUTE] REDIRECT LOOP DETECTED! Stopping navigation.')
          return false // Stop navigation
        }
      } else {
        redirectCount = 0
      }

      lastRedirectTime = now
      navigationHistory.push(to.path)

      console.log('[ROUTE]', from.fullPath, '→', to.fullPath, {
        history: navigationHistory.slice(-5)
      })
    })

    router.afterEach(() => {
      redirectCount = 0
    })

    // Global error listener
    window.addEventListener('error', (e) => {
      console.log('[GLOBAL ERROR]', e.message, e.filename, e.lineno)
    })

    // Unhandled promise rejection
    window.addEventListener('unhandledrejection', (e) => {
      console.log('[UNHANDLED REJECTION]', e.reason)
    })

    console.log('[ROUTER DEBUG] Plugin initialized with loop detection')
  }
})
