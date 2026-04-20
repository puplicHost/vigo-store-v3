// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // تفعيل ميزات Nuxt 4 الأساسية (مثل مجلد app/ الجديد)
  future: {
    compatibilityVersion: 4,
  },

  // تاريخ التوافق (يفضل إبقاؤه على النسخة الحالية المستقرة)
  compatibilityDate: '2024-11-01',

  devtools: { enabled: true },

  // الموديولات التي قمت بتثبيتها
  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
  ],

  // Global CSS
  css: ['~/assets/css/main.css'],

  // إعدادات Pinia لضمان التعرف على الـ Stores في بنية Nuxt 4
  pinia: {
    storesDirs: ['./app/stores/**'],
  },

  // إذا كنت تستخدم Prisma، يفضل إضافة هذا التكوين للتأكد من استبعادها من الـ Client-side bundle
  nitro: {
    experimental: {
      openAPI: true
    },
    // Set body size limit to 10MB for large logo uploads
    runtimeConfig: {
      nitro: {
        bodySizeLimit: '10mb'
      }
    },
    // Server middleware for request tracking, observability, and rate limiting
    routeRules: {
      '/api/**': {
        cors: true
      }
    }
  },

  // إعدادات ESLint (اختياري: لتخصيص سلوك الفحص)
  eslint: {
    config: {
      stylistic: true // تفعيل التنسيق الجمالي للكود
    }
  },

  // Vite: dev stability (reduces vite-node IPC disconnects on some Windows setups)
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'vue3-apexcharts'
      ]
    },
    server: {
      watch: {
        usePolling: process.platform === 'win32',
      },
    },
  },

  // i18n Configuration
  i18n: {
    locales: [
      { code: 'en', name: 'English', dir: 'ltr', file: 'en.json' },
      { code: 'ar', name: 'العربية', dir: 'rtl', file: 'ar.json' }
    ],
    defaultLocale: 'en',
    langDir: '../i18n/locales/',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale'
    }
  }
})