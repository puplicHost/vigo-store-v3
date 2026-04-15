# 🎯 Admin Dashboard Upgrades — الخطة الكاملة

> هذا الملف يشرح بالتفصيل كل الخطوات المطلوبة لترقية لوحة التحكم إلى مستوى احترافي.

---

## 📋 الفهرس

1. [الدارك مود (Dark Mode)](#1--الدارك-مود-dark-mode)
2. [نظام الإشعارات (Notifications)](#2--نظام-الإشعارات-notifications)
3. [ربط الإعدادات بالموقع الرئيسي](#3--ربط-الإعدادات-بالموقع-الرئيسي)
4. [دعم اللغة العربية والإنجليزية (i18n)](#4--دعم-اللغة-العربية-والإنجليزية-i18n)
5. [اقتراحات احترافية إضافية](#5--اقتراحات-لجعل-لوحة-التحكم-احترافية)

---

## 1. 🌙 الدارك مود (Dark Mode)

### الحالة الحالية — ✅ مكتمل (Completed)
- تم تعريف CSS Variables في `main.css`.
- تم تحديث Layout الأدمن والصفحات الرئيسية لتدعم التغيير اللحظي.
- زر الـ Toggle يعمل ويحفظ حالة الثيم في الـ localStorage.
- تم صبغ جميع المكونات (Modals, Tables, Forms) لتكون متوافقة مع الوضعين.

### الحل — الخطوات المطلوبة

#### الخطوة 1: تعريف CSS Variables للوضعين
**الملف**: `app/assets/css/main.css` (أو ملف الـ global styles)

```css
/* ====== Light Mode (Default) ====== */
:root {
  --color-surface:              #FAF9F6;
  --color-surface-container:    #F0EFEC;
  --color-surface-container-low: #F5F4F1;
  --color-surface-container-high: #E8E7E4;
  --color-on-surface:           #1C1B1B;
  --color-on-surface-variant:   #6B6560;
  --color-outline-variant:      #D1C5B4;
  --color-primary:              #775A19;
  --color-primary-container:    #C5A059;
  --color-on-primary:           #FFFFFF;
  --color-error:                #BA1A1A;
  --color-success:              #2E7D32;
  --color-warning:              #F9A825;
  --color-card-bg:              #FFFFFF;
  --color-border:               rgba(209, 197, 180, 0.2);
}

/* ====== Dark Mode ====== */
.dark {
  --color-surface:              #121212;
  --color-surface-container:    #1E1E1E;
  --color-surface-container-low: #181818;
  --color-surface-container-high: #2A2A2A;
  --color-on-surface:           #E6E1DC;
  --color-on-surface-variant:   #A09A94;
  --color-outline-variant:      #49443F;
  --color-primary:              #C5A059;
  --color-primary-container:    #775A19;
  --color-on-primary:           #1C1B1B;
  --color-error:                #FFB4AB;
  --color-success:              #81C784;
  --color-warning:              #FFD54F;
  --color-card-bg:              #1E1E1E;
  --color-border:               rgba(73, 68, 63, 0.4);
}
```

#### الخطوة 2: تحديث `admin.vue` Layout
استبدال الألوان الثابتة (`bg-white`, `border-outline-variant/20`) بالمتغيرات:

```html
<!-- قبل -->
<aside class="w-64 bg-white border-r border-outline-variant/20">

<!-- بعد -->
<aside class="w-64 bg-[var(--color-card-bg)] border-r border-[var(--color-border)]">
```

> **ملاحظة مهمة**: يجب تحديث كل عنصر يستخدم `bg-white` في layout الأدمن والصفحات الفرعية.

#### الخطوة 3: ضمان تحميل الثيم عند بدء التطبيق
في `admin.vue`، الـ `initTheme()` موجود بالفعل في `onMounted`. هذا كافٍ.

#### الملخص
| الملف | التعديل |
|---|---|
| `app/assets/css/main.css` | إضافة CSS Variables للوضعين |
| `app/layouts/admin.vue` | استبدال الألوان الثابتة بمتغيرات |
| `app/pages/admin/*.vue` | تحديث `bg-white` → `bg-[var(--color-card-bg)]` في كل الصفحات |
| `app/composables/useTheme.ts` | ✅ جاهز — لا يحتاج تعديل |

---

## 2. 🔔 نظام الإشعارات (Notifications)

### الحالة الحالية — ✅ مكتمل (Completed)
- تم ربط الجرس بصفحة الإشعارات.
- تم إضافة ميزة "View All Notifications" في القائمة المنسدلة.
- تم تفعيل نظام الـ Toasts الاحترافي للتنبيهات بدلاً من الـ simple alert.
- تم تطبيق التصميم المتوافق مع الدارك مود واللغات على الإشعارات.

### الحل المطلوب — 3 مراحل

#### المرحلة 1: ربط الجرس بصفحة الإشعارات
**الملف**: `app/layouts/admin.vue`

```html
<!-- إضافة رابط "View All" في الـ dropdown -->
<div class="p-3 border-t border-outline-variant/10 text-center">
  <NuxtLink
    to="/admin/notifications"
    @click="showNotifDropdown = false"
    class="text-[11px] uppercase font-bold text-primary hover:underline tracking-wider"
  >
    View All Notifications
  </NuxtLink>
</div>
```

#### المرحلة 2: إشعارات تلقائية عند الأحداث
أضف استدعاءات `toast` في الأماكن الصحيحة:

```ts
// عند إنشاء منتج جديد (admin/index.vue)
toast.success('Product created successfully', 'New Product')

// عند حصول طلب جديد (يحتاج WebSocket أو polling)
toast.info(`New order #${orderId} received`, 'New Order')

// عند تغيير الإعدادات
toast.success('Store settings updated', 'Settings')
```

#### المرحلة 3 (اختيارية — متقدمة): تخزين الإشعارات في قاعدة البيانات

##### أ. إضافة موديل Notification في Prisma:
```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String?
  user      User?    @relation(fields: [userId], references: [id])
  title     String
  message   String
  type      String   @default("info")  // info, success, warning, error
  read      Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([userId, read])
  @@index([createdAt])
}
```

##### ب. إنشاء API Routes:
| Route | Method | الوظيفة |
|---|---|---|
| `/api/admin/notifications` | GET | جلب إشعارات المستخدم |
| `/api/admin/notifications/[id]` | PATCH | تحديد كمقروء |
| `/api/admin/notifications/mark-all` | POST | تحديد الكل كمقروء |

##### ج. تحديث `useNotifications.ts`:
```ts
// بدلاً من useState فقط، نجلب من الـ API:
const { data: notifications } = await useApiFetch('/api/admin/notifications')
```

### الملخص
| المرحلة | الأولوية | الملفات |
|---|---|---|
| ربط الجرس بالصفحة | 🔴 عالية | `admin.vue` |
| إشعارات تلقائية | 🟡 متوسطة | صفحات الأدمن المختلفة |
| تخزين في DB | 🟢 اختيارية | `schema.prisma`, API routes, composable |

---

## 3. ⚙️ ربط الإعدادات بالموقع الرئيسي

### الحالة الحالية — ✅ مكتمل (Completed)
- تم إنشاء API عام للإعدادات.
- تم ربط SEO الموقع بالكامل (Title, Description, Keywords) ببيانات الأدمن.
- تم ربط الـ Footer ومعلومات التواصل بالسوشيال ميديا.
- تم ربط العملة (Currency) المستخدمة في الموقع واللوحة بالإعدادات.

### المطلوب — ربط كل إعداد بالمكان الصحيح

#### 1. اسم المتجر والـ SEO
**الملف**: `app/app.vue` أو `app/layouts/default.vue`

```ts
const { settings } = useSettings()

useHead(() => ({
  title: settings.value.siteName || 'Vigo Store',
  meta: [
    { name: 'description', content: settings.value.siteDescription || '' },
    { name: 'keywords', content: settings.value.siteKeywords || '' }
  ]
}))
```

#### 2. العملة (Currency)
**الملفات المتأثرة**: كل مكان يعرض سعر

```html
<!-- قبل -->
<p>${{ product.price.toFixed(2) }}</p>

<!-- بعد -->
<p>{{ settings.currency }}{{ product.price.toFixed(2) }}</p>
```

#### 3. وضع الصيانة (Maintenance Mode)
**الملف**: `server/middleware/maintenance.ts` (ملف جديد)

```ts
export default defineEventHandler(async (event) => {
  // تجاهل routes الأدمن و API
  if (event.path.startsWith('/admin') || event.path.startsWith('/api')) return

  const settings = await prisma.settings.findFirst()
  if (settings?.maintenanceMode) {
    // إعادة التوجيه لصفحة الصيانة
    return sendRedirect(event, '/maintenance')
  }
})
```

#### 4. معلومات التواصل
**الملف**: Footer في الصفحات العامة

```html
<a :href="`mailto:${settings.contactEmail}`">{{ settings.contactEmail }}</a>
<a :href="`tel:${settings.contactPhone}`">{{ settings.contactPhone }}</a>
<a :href="`https://wa.me/${settings.whatsappNumber}`">WhatsApp</a>
```

#### 5. روابط السوشيال ميديا
```html
<a v-if="settings.facebookUrl" :href="settings.facebookUrl" target="_blank">Facebook</a>
<a v-if="settings.instagramUrl" :href="settings.instagramUrl" target="_blank">Instagram</a>
```

#### 6. الشحن
**مستخدم بالفعل** في `checkout/index.vue`. ✅

### إنشاء API عام للإعدادات (بدون حماية)
**ملف جديد**: `server/api/settings.get.ts`

```ts
// API عام — لا يحتاج auth — يعرض فقط البيانات الآمنة
export default defineEventHandler(async () => {
  const settings = await prisma.settings.findFirst()
  return {
    siteName: settings?.siteName,
    siteDescription: settings?.siteDescription,
    currency: settings?.currency,
    maintenanceMode: settings?.maintenanceMode,
    contactEmail: settings?.contactEmail,
    contactPhone: settings?.contactPhone,
    whatsappNumber: settings?.whatsappNumber,
    facebookUrl: settings?.facebookUrl,
    instagramUrl: settings?.instagramUrl,
    twitterUrl: settings?.twitterUrl,
    shippingFee: settings?.shippingFee,
    freeShippingThreshold: settings?.freeShippingThreshold,
    isCodEnabled: settings?.isCodEnabled,
    isStripeEnabled: settings?.isStripeEnabled
    // ⚠️ لا نعرض: stripeSecretKey, stripePublicKey, isTestMode
  }
})
```

---

## 4. 🌍 دعم اللغة العربية والإنجليزية (i18n) — ✅ مكتمل (Completed)
- تم تثبيت وإعداد `@nuxtjs/i18n`.
- تم إنشاء ملفات الترجمة `en.json` و `ar.json` في مجلد `i18n/locales/`.
- تم إضافة زر تبديل اللغة (AR/EN) والتعامل مع الـ RTL تلقائياً.
- تم ترجمة (Layout الأدمن، صفحة المنتجات، صفحة التصنيفات، صفحة الإعدادات، الدشبورد).

### النهج المقترح: استخدام `@nuxtjs/i18n`

#### الخطوة 1: التثبيت
```bash
npm install @nuxtjs/i18n
```

#### الخطوة 2: الإعدادات في `nuxt.config.ts`
```ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],

  i18n: {
    locales: [
      { code: 'en', name: 'English', dir: 'ltr', file: 'en.json' },
      { code: 'ar', name: 'العربية', dir: 'rtl', file: 'ar.json' }
    ],
    defaultLocale: 'en',
    langDir: 'locales/',
    strategy: 'no_prefix',   // لا يغيّر الـ URL
    detectBrowserLanguage: {  // اكتشاف لغة المتصفح
      useCookie: true,
      cookieKey: 'i18n_locale'
    }
  }
})
```

#### الخطوة 3: إنشاء ملفات الترجمة

**ملف `locales/en.json`:**
```json
{
  "sidebar": {
    "dashboard": "Dashboard",
    "inventory": "Inventory",
    "categories": "Categories",
    "orders": "Orders",
    "users": "Users",
    "settings": "Settings",
    "signOut": "Sign Out"
  },
  "topbar": {
    "search": "Search...",
    "notifications": "Notifications",
    "markAllRead": "Mark all read",
    "viewAll": "View All Notifications"
  },
  "products": {
    "title": "Inventory",
    "subtitle": "Manage your products",
    "addProduct": "Add Product",
    "name": "Product Name",
    "price": "Price",
    "stock": "Stock",
    "category": "Category",
    "actions": "Actions",
    "edit": "Edit",
    "delete": "Delete",
    "noProducts": "No products found"
  },
  "settings": {
    "title": "Store Settings",
    "general": "General",
    "shipping": "Shipping",
    "contact": "Contact",
    "social": "Social Media",
    "payment": "Payment",
    "save": "Save Changes",
    "saving": "Saving...",
    "cancel": "Cancel"
  },
  "common": {
    "loading": "Loading...",
    "error": "Something went wrong",
    "success": "Success",
    "confirm": "Confirm",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "create": "Create",
    "save": "Save"
  }
}
```

**ملف `locales/ar.json`:**
```json
{
  "sidebar": {
    "dashboard": "لوحة التحكم",
    "inventory": "المنتجات",
    "categories": "التصنيفات",
    "orders": "الطلبات",
    "users": "المستخدمين",
    "settings": "الإعدادات",
    "signOut": "تسجيل الخروج"
  },
  "topbar": {
    "search": "بحث...",
    "notifications": "الإشعارات",
    "markAllRead": "تحديد الكل كمقروء",
    "viewAll": "عرض كل الإشعارات"
  },
  "products": {
    "title": "المنتجات",
    "subtitle": "إدارة المنتجات الخاصة بك",
    "addProduct": "إضافة منتج",
    "name": "اسم المنتج",
    "price": "السعر",
    "stock": "المخزون",
    "category": "التصنيف",
    "actions": "الإجراءات",
    "edit": "تعديل",
    "delete": "حذف",
    "noProducts": "لا توجد منتجات"
  },
  "settings": {
    "title": "إعدادات المتجر",
    "general": "عام",
    "shipping": "الشحن",
    "contact": "التواصل",
    "social": "وسائل التواصل",
    "payment": "الدفع",
    "save": "حفظ التغييرات",
    "saving": "جارٍ الحفظ...",
    "cancel": "إلغاء"
  },
  "common": {
    "loading": "جارٍ التحميل...",
    "error": "حدث خطأ",
    "success": "تم بنجاح",
    "confirm": "تأكيد",
    "cancel": "إلغاء",
    "delete": "حذف",
    "edit": "تعديل",
    "create": "إنشاء",
    "save": "حفظ"
  }
}
```

#### الخطوة 4: الاستخدام في الـ Layout
```html
<!-- admin.vue -->
<script setup>
const { locale, setLocale, t } = useI18n()
</script>

<template>
  <!-- زر تبديل اللغة في Top Bar -->
  <button @click="setLocale(locale === 'en' ? 'ar' : 'en')">
    {{ locale === 'en' ? 'عربي' : 'EN' }}
  </button>

  <!-- بدل الأسماء الثابتة نستخدم $t -->
  <span>{{ $t('sidebar.dashboard') }}</span>
</template>
```

#### الخطوة 5: دعم RTL تلقائي
```ts
// في admin.vue أو plugin
watch(locale, (lang) => {
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = lang
})
```

#### الخطوة 6: إعدادات CSS للعربية
```css
/* RTL Support */
[dir="rtl"] .sidebar { border-left: 1px solid var(--color-border); border-right: none; }
[dir="rtl"] .ml-auto { margin-right: auto; margin-left: 0; }
/* Tailwind يدعم RTL بشكل أساسي مع utilities مثل: */
/* me-4 (margin-end), ms-4 (margin-start), etc. */
```

---

## 5. 💎 اقتراحات لجعل لوحة التحكم احترافية

### أ. تحسينات الـ UX/UI

| الاقتراح | الوصف | الأولوية |
|---|---|---|
| **Breadcrumbs** | شريط تنقل يوضح مكان المستخدم (الرئيسية > المنتجات > تعديل) | 🔴 عالية |
| **Loading Skeletons** | استخدام skeleton screens بدل الـ spinner | 🟡 متوسطة |
| **Confirmation Dialogs** | نوافذ تأكيد جميلة بدل `alert()` الافتراضي | 🔴 عالية |
| **Toast System** | نظام إشعارات مؤقتة في زاوية الشاشة (موجود جزئياً) | 🟡 متوسطة |
| **Keyboard Shortcuts** | اختصارات لوحة المفاتيح (Ctrl+S للحفظ، / للبحث) | 🟢 منخفضة |
| **Mobile Responsive** | القائمة الجانبية تصبح hamburger menu على الموبايل | 🔴 عالية |

### ب. ميزات وظيفية

| الاقتراح | الوصف | الأولوية |
|---|---|---|
| **Activity Log** | سجل نشاطات يسجل كل عملية (مين عدّل إيه ومتى) | 🟡 متوسطة |
| **Export to Excel/PDF** | تصدير الطلبات والمنتجات كملفات | 🟡 متوسطة |
| **Image Upload System** | رفع الصور لـ Cloudinary أو S3 بدل base64 | 🔴 عالية |
| **Bulk Actions** | تحديد عدة منتجات وحذفها/تعديلها مرة واحدة | 🟡 متوسطة |
| **Advanced Filters** | فلترة متقدمة (بالسعر، التصنيف، التاريخ) | 🟡 متوسطة |
| **Dashboard Charts** | إحصائيات حقيقية مع رسوم بيانية (Chart.js أو ApexCharts) | 🔴 عالية |
| **Real-time Updates** | تحديثات لحظية باستخدام WebSocket أو SSE | 🟢 منخفضة |

### ج. الأمان

| الاقتراح | الوصف | الأولوية |
|---|---|---|
| **Session Timeout** | تسجيل خروج تلقائي بعد فترة عدم نشاط | 🔴 عالية |
| **2FA** | مصادقة ثنائية العامل للمدراء | 🟡 متوسطة |
| **IP Whitelist** | تقييد الوصول للوحة التحكم بعناوين IP محددة | 🟢 منخفضة |
| **Password Policy** | فرض كلمات مرور قوية | 🟡 متوسطة |

### د. تحسينات الأداء

| الاقتراح | الوصف | الأولوية |
|---|---|---|
| **Pagination** | التقسيم لصفحات للمنتجات والطلبات | 🔴 عالية |
| **Infinite Scroll** | تحميل تدريجي عند التمرير | 🟡 متوسطة |
| **Caching** | تخزين مؤقت للبيانات المتكررة | 🟡 متوسطة |
| **Lazy Loading** | تحميل الصفحات عند الحاجة فقط | 🟢 منخفضة |

---

## 📊 ترتيب التنفيذ المقترح

```
المرحلة 1 (الأساسيات):
  ├── 1.1  تفعيل Dark Mode بالكامل
  ├── 1.2  ربط الجرس بصفحة الإشعارات
  └── 1.3  ربط الإعدادات بالموقع الرئيسي

المرحلة 2 (الاحترافية):
  ├── 2.1  تركيب i18n (عربي/إنجليزي)
  ├── 2.2  استبدال alert() بـ Confirmation Dialogs
  ├── 2.3  إضافة Breadcrumbs
  └── 2.4  Mobile Responsive Sidebar

المرحلة 3 (التطوير):
  ├── 3.1  Dashboard Charts حقيقية
  ├── 3.2  نظام رفع الصور (Cloudinary)
  ├── 3.3  Activity Log
  └── 3.4  Export to Excel
```

---

> **ملاحظة**: هذا الملف هو خطة مرجعية. عند الرغبة في تنفيذ أي مرحلة، أخبرني وسأقوم بتنفيذها مباشرة.
