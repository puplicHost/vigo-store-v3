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
  ],

  // إعدادات Pinia لضمان التعرف على الـ Stores في بنية Nuxt 4
  pinia: {
    storesDirs: ['./app/stores/**'],
  },

  // إذا كنت تستخدم Prisma، يفضل إضافة هذا التكوين للتأكد من استبعادها من الـ Client-side bundle
  nitro: {
    experimental: {
      openAPI: true
    }
  },

  // إعدادات ESLint (اختياري: لتخصيص سلوك الفحص)
  eslint: {
    config: {
      stylistic: true // تفعيل التنسيق الجمالي للكود
    }
  }
})