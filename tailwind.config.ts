import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-container': 'var(--primary-container)',
        background: 'var(--background)',
        surface: 'var(--surface)',
        'on-background': 'var(--on-background)',
        'on-primary': 'var(--on-primary)',
        'on-surface': 'var(--on-surface)',
        'on-surface-variant': 'var(--on-surface-variant)',
        'surface-container': 'var(--surface-container)',
        'surface-container-low': 'var(--surface-container-low)',
        'surface-container-lowest': 'var(--surface-container-lowest)',
        error: 'var(--error)',
        'error-container': 'var(--error-container)',
        outline: 'var(--outline)',
        'outline-variant': 'var(--outline-variant)',
      },
      fontFamily: {
        body: ['Manrope', 'sans-serif'],
        serif: ['Noto Serif', 'serif'],
        headline: ['Noto Serif', 'serif'],
        label: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
