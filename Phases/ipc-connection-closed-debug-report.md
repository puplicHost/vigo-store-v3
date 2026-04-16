# Debugging Report: `500 Internal Server Error` + `IPC connection closed` (Nuxt Admin Dashboard)

## Executive Summary

المشكلة تظهر عند فتح `/admin/dashboard` خصوصًا أثناء التطوير (HMR/Refresh/تعديلات UI) على شكل:

- `500 Internal Server Error`
- `IPC connection closed`

بعد فحص الشجرة البرمجية والواجهات المرتبطة والأكواد السيرفرية:

1. **السبب الأقرب على مستوى الكود (للـ 500 في dashboard):** crash محتمل داخل `app/pages/admin/dashboard/index.vue` بسبب **افتراضات غير محمية** على شكل بيانات الطلبات (مثال: `order.id.slice(...)` و`order.totalAmount.toFixed(2)`).
2. **أسباب backend مؤكدة (قد تسبب 500 في مسارات أخرى وتزيد هشاشة السيرفر):**
   - `server/api/auth/register.post.ts`: يستخدم `prisma` بدون import.
   - `server/api/auth/login.post.ts`: يستخدم `logger` بدون import.
   - `server/api/admin/orders/[id].patch.ts`: يستخدم `Object.values(Prisma.OrderStatus)` بشكل قد يؤدي إلى `TypeError` (حسب Prisma client runtime).
   - `server/api/admin/users/[id].delete.ts`: مقارنة خاطئة للمستخدم الحالي (`currentUser.id` بدل payload الصحيح)، وتعليق الـ cascade غير مطابق للشِـكل الفعلي للـ schema.
3. **عامل بيئي قوي جدًا لوضع Dev/Stability على ويندوز:** سجلات التطوير تظهر `spawn EPERM` وظهور `IPC disconnect` لاحقًا. هذا عامل مستقل لكنه يفسر “randomness” في ظهور IPC بعد تغييرات.

النتيجة: `IPC connection closed` غالبًا **عرض لاحق** لسقوط/انهيار runtime (SSR render crash أو nitro worker fail)، وليس السبب الأول.

---

## Root Cause Analysis

### السبب الأول (رجّحته أعلى)

`app/pages/admin/dashboard/index.vue` يعرض قائمة طلبات حديثة داخل template يفترض:

- أن `order.id` دائمًا `string`
- وأن `order.totalAmount` دائمًا رقم

إذا API أعاد items فيها `id` غير string أو `totalAmount` null/undefined، سيحدث exception أثناء SSR render:

- `order.id.slice` قد ينهار إذا `order.id` ليس string
- `order.totalAmount.toFixed` قد ينهار إذا `totalAmount` ليس رقم

أي exception غير معالج أثناء render SSR → `500`. في وضع dev، قد ينتهي الأمر بسقوط عملية Nitro/Vite worker → `IPC connection closed`.

### السبب الثاني (مؤكد على backend)

وجود `ReferenceError` أو `TypeError` في handlers سيرفرية يزيد احتمال حصول 500 في لحظات غير متوقعة (خصوصًا أثناء التنقل/refresh أو触 طرق auth/admin أخرى).

---

## Failure Chain (Step-by-step)

### سلسلة A: Crash داخل SSR dashboard → Nitro worker crash → IPC

1. تغيير UI في dashboard أو refresh على `/admin/dashboard`
2. HMR يعيد تنفيذ SSR/renderer
3. `useApiFetch` يجلب `orders/products/users/categories` (أو يعيد hydration state)
4. بيانات `recentOrders` تصل بأحد الحقول بشكل غير متوافق (null/undefined أو type mismatch)
5. template يحاول تنفيذ:
   - `order.id.slice(-8)`
   - `order.totalAmount.toFixed(2)`
6. exception غير محجوب → SSR render يفشل
7. Nitro worker يسقط/يفشل → dev tooling يفقد IPC → `IPC connection closed`

### سلسلة B: عامل بيئي `spawn EPERM` → IPC instability

1. في سجلات dev يظهر `spawn EPERM`
2. Nitro/Vite child processes قد لا تعمل/لا تُspawn بنجاح
3. فيتولد IPC disconnect في middleware/handlers meta (ملاحظات في logs)
4. حتى لو root bug في dashboard قد يكون “قابل للحل”، factor بيئي يجعل ظهور المشكلة “عشوائي”

---

## Layer-by-Layer Debug

## 1) Pages (Dashboard)

### الملف
`app/pages/admin/dashboard/index.vue`

### نقاط خطورة

1. **unsafe access داخل template**
   - `order.id.slice(-8).toUpperCase()`
   - `order.totalAmount.toFixed(2)`
2. dashboard يجلب بيانات متعددة عبر `await useApiFetch(...)` على مستوى الصفحة
   - حتى إن كانت الـ `ClientOnly` تحمي charts، فإن template الجداول/الحقول الأخرى لا تكون protected بنفس الطريقة.
3. وجود dynamic Tailwind classes في quick actions:
   - ليس سبب crash، لكنه يزيد عدم الاتساق Visual أثناء dev.

### ماذا يعني ذلك عمليًا؟

أي اختلاف بسيط في API shape أو seed data أو enum values سيسقط SSR render.

---

## 2) Layouts

### الملف
`app/layouts/admin.vue`

### تقييم

- استخدام `document` و`localStorage` موجود داخل `onMounted` أو `watch` محمي بـ `process.client` → غالبًا آمن من SSR crash.
- لكنه يعقد سلسلة التنفيذ ويجعل أي composable غير مستقر يؤثر على كل صفحات admin.

---

## 3) Middleware

### `app/middleware/admin-guard.global.ts`

- إذا `auth.isLoading.value` true → middleware يرجع بدون redirect.
- هذا قد يسبب race أثناء أول load، لكنه عادة يعطي login redirects وليس 500.

### `app/middleware/permissions.ts`

- إذا `!auth.user.value` → return (بدون منع صريح)
- يعتمد على أن admin-guard سينفذ بشكل صحيح وبالترتيب الصحيح.

---

## 4) Server API Routes

## 4.1) Auth

### `server/api/auth/login.post.ts`
- `logger.error` مستخدم في catch بدون import → `ReferenceError` عند أي خطأ غير مصنف بـ `statusCode`.

### `server/api/auth/register.post.ts`
- `prisma` مستخدم بدون import → `ReferenceError`.

## 4.2) Admin Orders

### `server/api/admin/orders/[id].patch.ts`
- يستخدم `Object.values(Prisma.OrderStatus)`
- حسب Prisma client runtime، قد لا تكون `Prisma.OrderStatus` متاحة بهذه الطريقة → `TypeError` → 500 على route PATCH.

## 4.3) Admin Users

### `server/api/admin/users/[id].delete.ts`
- مقارنة `id === currentUser.id` على الرغم من أن payload عادة يحتوي `userId`، وليس `id`.
- تعليق cascade لا يطابق schema (Order.user بدون `onDelete: Cascade` على مستوى العلاقة).
- قد يؤدي إلى constraint failure من قاعدة البيانات → 500.

## 4.4) Seed Route

### `server/api/admin/seed.post.ts`
- في catch يستخدم `return createError(...)` بدل `throw createError(...)`
- هذا لا يضمن 500 دائمًا لكن يعطي سلوك غير موحد وصعب في التشخيص.

---

## 5) Prisma / Database

- schema يحتوي datasource على `DATABASE_URL` وـ enums صحيحة (OrderStatus, PaymentStatus, Role).
- المشكلة ليست “DB down” بالكامل، لأن `/api/settings` يعمل فعليًا.
- لكن DB constraints (حذف user لديه orders) قد تؤدي إلى 500 في routes admin/users delete.

---

## 6) Nuxt Plugins

### `app/plugins/auth.ts`

- يقوم بعمل `fetchUser()` إذا token cookie موجود و `user` state null.
- عادة جيد لتقليل flicker.
- لكنه يزيد التعقيد وقت SSR/Hydration وقد يظهر كأثر جانبي إذا حصل crash آخر.

---

## 7) Nuxt Config & Dependencies

### `nuxt.config.ts`

- لا يظهر misconfiguration مباشر للـ runtime config.
- لكن عامل بيئي: سجلات dev فيها `spawn EPERM` الذي قد يسبب IPC disconnect بغض النظر عن الكود.

### `package.json`

- `bcrypt` موجود في `devDependencies` وليس `dependencies`.
- في بيئات تستبعد devDependencies قد تتعطل auth routes.

---

## Fix Plan (Phased)

## Phase 1 — Immediate Fix (Critical Stabilization)

### 1) إصلاح dashboard SSR unsafe template

الهدف: منع أي exception من الـ render حتى لو API أعاد بيانات غير متوقعة.

خطوات:

1. إنشاء “view model” آمنة لـ `recentOrders` في computed:
   - `id` إلى string بعناية
   - `totalAmount` إلى number مع fallback 0
2. استخدام view model داخل template بدل الوصول المباشر للحقول الخام.

### 2) تحسين الحماية في computed/statistics

أي computed يعتمد على numeric conversion لازم يضمن تحويل آمن:

- `Number(value ?? 0)`
- `typeof value === 'number' ? value : 0`

---

## Phase 2 — Stabilization (Remove backend 500 sources)

### 1) إصلاح ReferenceErrors المؤكدة

- استبدال/إضافة imports:
  - `register.post.ts`: `import prisma from '../../utils/prisma'`
  - `login.post.ts`: `import { logger } from '../../utils/logger'` (أو استخدم `console.error` مؤقتًا)

### 2) إصلاح enum validation في orders PATCH

- استخدام enum export الصحيح من `@prisma/client`:
  - مثال: `import { OrderStatus } from '@prisma/client'`
  - ثم `Object.values(OrderStatus)`

### 3) إصلاح delete user policy

- استخدم payload الصحيح (`userId`) بدل `id`
- راجع schema/cascade أو أضف خطوات حذف order items أولًا قبل حذف user.

### 4) seed catch: استبدال `return createError` بـ `throw createError`

---

## Phase 3 — Architecture Hardening (Prevent recurrence)

### 1) Data validation layer

- إدخال Zod schemas لكل API response payload (خصوصًا admin orders/users/products)
- أو على الأقل normalizers في `useApiFetch.transform` بدل الاعتماد على shape raw.

### 2) SSR error boundaries

- اجعل dashboard widgets تتعامل مع errors محليًا بدل سقوط الصفحة بالكامل.
- مثال: widget يحفظ state `error` ويعرض empty state بدل crash.

### 3) Improve SSR logging

- أضف logging موجه لـ dashboard data pipeline:
  - `try/catch` حول normalization
  - log للـ type mismatch (id/totalAmount)

---

## Code Fix Examples

### 1) Safe mapping for `recentOrders` (dashboard)

داخل `app/pages/admin/dashboard/index.vue`:

```ts
const safeRecentOrders = computed(() => {
  const ordersArray = Array.isArray(orders.value) ? orders.value : []
  return ordersArray.slice(0, 5).map((order: any) => {
    const idStr = typeof order?.id === 'string' ? order.id : ''
    const totalAmountNum = Number(order?.totalAmount ?? 0)
    return {
      id: idStr,
      displayId: idStr ? idStr.slice(-8).toUpperCase() : 'N/A',
      totalAmount: Number.isFinite(totalAmountNum) ? totalAmountNum : 0,
      userName: order?.user?.name || 'Guest',
      status: order?.status || 'UNKNOWN',
    }
  })
})
```

ثم في template استخدم `safeRecentOrders` بدل `recentOrders`:

```vue
<tr v-for="order in safeRecentOrders" :key="order.id || order.displayId" ...>
  <td>#{{ order.displayId }}</td>
  <td>${{ order.totalAmount.toFixed(2) }}</td>
</tr>
```

---

### 2) Fix enum validation in `orders/[id].patch.ts`

مثال آمن:

```ts
import { OrderStatus } from '@prisma/client'

const validStatuses = Object.values(OrderStatus)
if (!validStatuses.includes(status)) {
  throw createError({ statusCode: 400, message: 'Invalid status' })
}
```

---

### 3) Fix missing imports in auth handlers

`server/api/auth/register.post.ts`

```ts
import prisma from '../../utils/prisma'
```

`server/api/auth/login.post.ts`

```ts
import { logger } from '../../utils/logger'
```

---

### 4) Fix seed route

استبدال:

```ts
return createError({ ... })
```

بـ:

```ts
throw createError({ ... })
```

---

## Final Recommendations

1. **ابدأ بتثبيت dashboard SSR crash** عبر safe view model (Critical).
2. **أصلح ReferenceErrors المؤكدة في auth/admin routes** (Critical/High).
3. **صلح enum validation في orders PATCH** لتجنب 500 عند تحديث حالة الطلب (High).
4. **عالِج factor `spawn EPERM`** لأنه قد يجعل المشكلة “عشوائية”:
   - تأكد من عدم وجود Antivirus/Policy تمنع spawn على Node/Nitro/Vite
   - تأكد من تشغيل dev server بشكل نظيف بدون نسخ متعددة وراقب log.
5. بعد كل مجموعة إصلاحات، نفّذ اختبارًا محددًا:
   - فتح `/admin/dashboard`
   - refresh بعد تعديل بسيط بالـ UI
   - فتح `/admin/orders`
   - تجربة PATCH لحالة order
   - (اختياري) seed من dashboard (إذا لديك صلاحية)

إذا رغبت، أستطيع تحويل هذه الخطة إلى **تنفيذ فعلي على الكود** (تعديلات dashboard + fixes على auth/admin endpoints) بالترتيب المذكور ثم إعادة تشغيل الاختبار للتأكد من اختفاء `500` و`IPC connection closed`.
