export const useTheme = () => {
  const isDark = useState<boolean>('theme_is_dark', () => false)

  // Watch for changes and apply class to document
  watch(isDark, (val) => {
    if (process.client) {
      if (val) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    }
  }, { immediate: true })

  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  const initTheme = () => {
    if (process.client) {
      const saved = localStorage.getItem('theme')
      if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDark.value = true
      }
    }
  }

  return {
    isDark: readonly(isDark),
    toggleTheme,
    initTheme
  }
}
