# Debug Report: Nuxt `500 Internal Server Error` / `IPC connection closed`

## 1. Executive Summary

تم فحص المشروع بشكل شامل عبر:

- صفحات الأدمن والـ dashboard
- `app/layouts/admin.vue`
- `app/middleware/*`
- `server/middleware/*`
- `server/api/admin/**`
- Auth APIs
- Prisma schema/config/env
- `app/plugins/*`
- `nuxt.config.ts`
- `package.json`
- سجلات التشغيل المتاحة

### النتيجة المختصرة

المشكلة ليست سببًا واحدًا فقط، بل يوجد **مزيج من مشكلتين**:

1. **سبب route-specific مرجح جدًا** يؤدي إلى `500` عند فتح `admin/dashboard`.
2. **عدة أخطاء backend مؤكدة** في بعض API routes وauth logic يمكن أن تنتج `500` في مسارات أخرى أو تجعل بيئة التطوير أكثر هشاشة.

### أهم الاستنتاجات

- تم التأكد عمليًا أن:
  - `http://localhost:3000/api/settings` يعمل ويرجع بيانات.
  - `http://localhost:3000/admin/dashboard` يرجع `500`.
- هذا يعني أن:
  - قاعدة البيانات ليست ساقطة بالكامل.
  - Prisma ليس مكسورًا بشكل عام.
  - المشكلة الأقرب هي داخل **SSR/render flow الخاص بالـ dashboard** أو في شيء يُحمَّل معه.
- رسالة `IPC connection closed` تبدو **نتيجة لاحقة** لانهيار أعمق داخل Nuxt/Vite/Nitro أثناء تنفيذ الصفحة، وليست السبب الجذري بحد ذاتها.

### أكثر الأسباب ترجيحًا

1. **Crash أثناء SSR في `app/pages/admin/dashboard/index.vue`** بسبب افتراض أن بعض القيم دائمًا موجودة وصحيحة.
2. **أخطاء backend مؤكدة** في بعض الملفات مثل:
   - `server/api/admin/orders/[id].patch.ts`
   - `server/api/auth/login.post.ts`
   - `server/api/auth/register.post.ts`
3. **عامل بيئي إضافي** ظهر أثناء الفحص داخل جلسة التطوير التي شغلتها من هنا:
   - `spawn EPERM`
   - هذا عامل منفصل ومهم، لكنه لا يفسر وحده خطأ `localhost:3000/admin/dashboard` على جهازك، لأنه ظهر داخل جلسة تشغيل مقيدة أثناء الفحص.

---

## 2. Root Cause Analysis

## الحالة الأقرب للسبب الحقيقي لخطأ `/admin/dashboard`

السبب الأكثر ترجيحًا لخطأ `500` في صفحة `admin/dashboard` هو وجود **وصول غير محمي إلى خصائص بيانات الطلبات داخل template** في `app/pages/admin/dashboard/index.vue`.

### الأدلة

الصفحة تعرض الطلبات الحديثة بهذه الصيغة:

- `order.id.slice(-8).toUpperCase()`
- `order.totalAmount.toFixed(2)`

هذه الأسطر ستنهار أثناء SSR إذا حصل أي من الآتي:

- `order.id` ليس string
- `order.id` مفقود
- `order.totalAmount` يساوي `null`
- `order.totalAmount` يساوي `undefined`
- `order.totalAmount` ليس number

### لماذا هذا يسبب `500`؟

لأن الصفحة تُرندر على السيرفر، وأي exception داخل render/template/computed أثناء SSR يؤدي إلى:

- `500 Internal Server Error`
- ثم قد يسقط worker/child process في dev mode
- فتظهر رسالة:
  - `IPC connection closed`

### لماذا هذا السبب أقوى من غيره؟

- لأن `api/settings` تعمل، فالمشكلة ليست database-wide.
- لأن layout نفسه لا يحتوي على browser API misuse واضح أثناء SSR.
- لأن dashboard يحمل بيانات متعددة ويعرضها مباشرة مع افتراضات غير محمية.

## هل `IPC connection closed` سبب أم نتيجة؟

في هذا المشروع، وبناءً على النمط الظاهر وسجل الأخطاء:

- `IPC connection closed` هو **غالبًا نتيجة**
- السبب الحقيقي أعمق، مثل:
  - unhandled SSR exception
  - route render crash
  - worker crash
  - أو خطأ بيئي في dev tooling

## هل توجد أسباب أخرى حقيقية؟

نعم. توجد **مشاكل مؤكدة فعليًا** في بعض الـ API routes وملفات auth. هذه المشاكل لا تفسر وحدها بالضرورة خطأ `dashboard` الحالي، لكنها قد تسبب:

- `500` في مسارات أخرى
- سلوك auth غير مستقر
- صعوبة في التشخيص
- زيادة احتمالات سقوط dev server

---

## 3. File-by-File Findings

## `app/pages/admin/dashboard/index.vue`

### المشكلة 1: Unsafe render assumptions في الطلبات الحديثة

- الموقع التقريبي:
  - سطر عرض رقم الطلب: `order.id.slice(-8).toUpperCase()`
  - سطر عرض المبلغ: `order.totalAmount.toFixed(2)`

### التأثير

- إذا كانت البيانات غير مكتملة أو غير متوقعة من API، يحصل crash أثناء SSR.
- هذا هو **المرشح الأول** لسبب `500` الحالي على `/admin/dashboard`.

### المشكلة 2: الصفحة تعتمد على 4 طلبات بيانات أثناء SSR

- `products`
- `categories`
- `orders`
- `users`

### التأثير

- يزيد سطح الخطأ أثناء SSR.
- إذا فشل request أو رجع data shape غير متوقع، الصفحة تصبح أكثر قابلية للانهيار.

### المشكلة 3: الإحصائيات تعتمد على أول صفحة فقط من البيانات

الـ APIs الإدارية paginated، لكن dashboard يحسب stats/charts على البيانات الراجعة فقط من أول request.

### التأثير

- ليس سببًا مباشرًا للـ `500`
- لكنه bug منطقي يجعل dashboard غير دقيق

### المشكلة 4: استخدام dynamic classes داخل quick actions

يوجد بناء classes ديناميكي مثل:

- ``bg-${link.color}/5``
- ``text-${link.color}``

### التأثير

- ليس سببًا مباشرًا للـ `500`
- لكنه قد يسبب Tailwind styling غير متوقع إذا لم تُلتقط classes أثناء build

---

## `app/layouts/admin.vue`

### النتيجة العامة

لم يظهر سبب قاطع للـ `500` من هذا الملف، لكن توجد نقاط تستحق المراجعة.

### المشكلة 1: layout يعتمد على composables مشتركة أثناء render

- `useAuth()`
- `usePermissions()`
- `useSearch()`
- `useTheme()`
- `useNotifications()`
- `useSettings()`
- `useI18n()`

### التأثير

- يرفع التعقيد العام للـ layout.
- أي خلل في أحد هذه composables قد ينعكس على كل صفحات الأدمن.

### المشكلة 2: route name derivation غير دقيق لكل الصفحات

يتم اشتقاق اسم الصفحة من:

- `route.path.split('/').pop()`

### التأثير

- ليس crash غالبًا
- لكنه قد يولد مفاتيح ترجمة غير صحيحة في بعض المسارات

### المشكلة 3: auth/permissions UI تعتمد على state قد لا تكون جاهزة دائمًا

قائمة `menuItems` تعتمد على `user.value` و`hasPermission()`.

### التأثير

- غالبًا ليس سبب `500`
- لكن قد يسبب سلوكًا متذبذبًا عند refresh أو race conditions

### الملاحظة المهمة

استخدام `document` و`localStorage` هنا ليس سببًا مباشرًا للمشكلة الحالية، لأن الوصول لهما موجود داخل:

- `onMounted`
- أو watch محمي بـ `process.client`

---

## `app/middleware/admin-guard.global.ts`

### المشكلة: guard يسمح بمرور route إذا كان `auth.isLoading` ما زال true

```ts
if (auth.isLoading.value) {
  return
}
```

### التأثير

- لا يسبب `500` غالبًا
- لكنه قد يسبب race condition عند أول تحميل
- وقد يسمح للصفحة بالاستمرار قبل اكتمال auth state

---

## `app/middleware/permissions.ts`

### المشكلة: إذا لم يوجد user، middleware يخرج بدون منع صريح

```ts
if (!auth.user.value) {
  return
}
```

### التأثير

- يعتمد بالكامل على أن `admin-guard.global.ts` يعمل قبله بشكل صحيح
- ليس سببًا مباشرًا للـ `500`
- لكنه يجعل منطق الحماية موزعًا وهشًا

---

## `app/plugins/auth.ts`

### المشكلة: plugin يستدعي `fetchUser()` عند وجود token بدون user state

### التأثير

- هذا السلوك مطلوب غالبًا
- لكنه يزيد احتمالات race بين:
  - plugin init
  - route middleware
  - render

### التقييم

- ليس متهمًا أوليًا في `500`
- لكنه جزء من سلسلة auth التي يجب تثبيتها

---

## `app/composables/useApiFetch.ts`

### المشكلة 1: الـ transform يوحّد أشكال مختلفة من الاستجابات

```ts
return res?.items || res?.data || res?.settings || res
```

### التأثير

- هذا مريح لكنه خطير نسبيًا
- أي route يرجع shape مختلف قد يمر دون type safety كافية
- قد يسمح بمرور data غير متوقعة إلى UI

### المشكلة 2: `watch: false`

### التأثير

- ليس سببًا مباشرًا للـ `500`
- لكنه قد يعقد إعادة التحديث أو تفسير behavior

---

## `app/composables/useSettings.ts`

### النتيجة

- `useAsyncData` هنا SSR-friendly
- endpoint العام `/api/settings` يعمل بالفعل

### الملاحظة

- هذا الملف لا يبدو السبب الرئيسي للمشكلة الحالية

---

## `app/composables/useTheme.ts`

### النتيجة

- الوصول إلى `document`, `localStorage`, `window.matchMedia` محمي بـ `process.client`

### التقييم

- ليس سببًا مباشرًا للـ `500`

---

## `server/middleware/auth.ts`

### المشكلة 1: غياب `JWT_SECRET` لا يرمي خطأ حاسم

```ts
if (!jwtSecret) {
  logger.error(...)
  return
}
```

### التأثير

- يؤدي إلى auth behavior صامت وغير واضح
- قد ينتج عنه users غير معرفين بدل فشل واضح

### المشكلة 2: middleware يحذف cookie عند token غير صالح

### التأثير

- هذا جيد أمنيًا
- لكنه قد يصعب التشخيص إذا لم يوجد logging كافٍ

### التقييم

- ليس السبب الأقرب لـ `dashboard 500`
- لكنه جزء مهم من استقرار المشروع

---

## `server/middleware/maintenance.ts`

### النتيجة

- middleware لا يمنع الطلبات عند فشل DB، بل يسجل الخطأ فقط ويكمل

### التأثير

- ليس سببًا مباشرًا للـ `500` الحالي
- لكنه قد يخفي مشاكل DB حقيقية أثناء التطوير

---

## `server/api/admin/orders/[id].patch.ts`

### المشكلة المؤكدة: استخدام `Prisma.OrderStatus` بشكل غير صحيح

الكود الحالي:

```ts
const validStatuses = Object.values(Prisma.OrderStatus)
```

### التأثير

- في Prisma الحديثة، enum غالبًا لا يكون متاحًا بهذه الصيغة runtime.
- هذا قد يسبب:
  - `TypeError`
  - ثم `500`

### التقييم

- **مشكلة مؤكدة**
- ليست السبب المرجح لفتح `/admin/dashboard`
- لكنها ستكسر route تحديث حالة الطلب

---

## `server/api/auth/login.post.ts`

### المشكلة المؤكدة: استخدام `logger` بدون import

في `catch`:

```ts
logger.error('[Login Error]', error)
```

### التأثير

- أي خطأ runtime داخل login يتحول إلى:
  - `ReferenceError: logger is not defined`
  - ثم `500`

### التقييم

- **مشكلة مؤكدة**
- تؤثر على login debugging وربما auth stability

---

## `server/api/auth/register.post.ts`

### المشكلة المؤكدة: استخدام `prisma` بدون import

الكود يستخدم:

- `prisma.user.findUnique`
- `prisma.user.create`

لكن لا يوجد import لـ `prisma`.

### التأثير

- `ReferenceError`
- ثم `500` عند التسجيل

### التقييم

- **مشكلة مؤكدة**

---

## `server/api/admin/users/[id].delete.ts`

### المشكلة 1: مقارنة خاطئة مع المستخدم الحالي

الكود يفحص:

```ts
if (id === currentUser.id)
```

لكن الـ JWT payload في middleware يحتوي:

- `userId`
- `email`
- `role`

ولا يحتوي `id`.

### التأثير

- حماية "لا تحذف نفسك" لا تعمل كما هو متوقع

### المشكلة 2: تعليق مضلل عن cascade

الكود يقول إن حذف المستخدم سيحذف الطلبات cascade، لكن schema لا يحدد `onDelete: Cascade` على `Order.user`.

### التأثير

- قد يحصل DB constraint failure
- ثم `500`

---

## `server/api/admin/seed.post.ts`

### المشكلة: إرجاع `createError(...)` بدل `throw createError(...)`

### التأثير

- سلوك غير متسق عند الفشل
- يصعب تفسيره من العميل

---

## `server/utils/auth.ts`

### المشكلة

يوجد throw على مستوى module إذا لم يوجد `JWT_SECRET`.

### التأثير

- إذا تم استيراد هذا الملف في أي مكان لاحقًا، قد يسقط worker أثناء التحميل

### التقييم

- **خطر كامن**
- ليس واضحًا أنه مستخدم الآن

---

## `prisma/schema.prisma`

### النتيجة

- datasource مضبوط على `DATABASE_URL`
- schema تبدو سليمة عمومًا

### المشكلة الأهم

العلاقة:

- `Order.user -> User`

لا تحتوي على `onDelete: Cascade`

### التأثير

- حذف مستخدم له طلبات قد يفشل
- ثم `500`

### ملاحظة إضافية

بما أن `/api/settings` يعمل، فهذا يعني أن:

- Prisma client يعمل على الأقل في بعض المسارات
- الاتصال بقاعدة البيانات موجود حاليًا

---

## `prisma.config.ts`

### النتيجة

- يعتمد على:
  - `env("DATABASE_URL")`

### التأثير

- إذا غاب هذا المتغير أو كان غير صالح، يفشل Prisma initialization

### التقييم الحالي

- ليس السبب المرجح الحالي، لأن الـ DB تعمل بالفعل في `/api/settings`

---

## `.env`

### النتيجة

الملف موجود ويحتوي على:

- `DATABASE_URL`
- `JWT_SECRET`
- `NODE_ENV`

### التقييم

- غياب env ليس المشكلة الحالية
- لكن قيمة `JWT_SECRET` تبدو placeholder/ضعيفة للتطوير فقط

---

## `.env.example`

### النتيجة

- يحتوي على المتغيرات الأساسية المطلوبة

### التقييم

- جيد كمرجع
- لكنه لا يضمن أن البيئة الفعلية دائمًا سليمة

---

## `nuxt.config.ts`

### المشكلة 1: لا يوجد `runtimeConfig`

### التأثير

- المشروع يعتمد مباشرة على `process.env`
- هذا أقل تنظيمًا ويصعب تتبع الإعدادات

### المشكلة 2: `vite.optimizeDeps.include` يتضمن `vue3-apexcharts`

### التأثير

- ليس خطأ مؤكدًا
- لكنه عنصر worth monitoring في بيئات Windows/dev إذا كانت مكتبة client-heavy

### المشكلة 3: `nitro.experimental.openAPI = true`

### التأثير

- ليس سببًا مباشرًا للـ dashboard error
- لكنه يزيد surface area في dev

---

## `package.json`

### المشكلة 1: `bcrypt` موجود داخل `devDependencies`

### التأثير

- في بيئات production أو CI التي تستبعد devDependencies:
  - auth routes وseed وبعض admin routes قد تنكسر
  - ثم `500`

### المشكلة 2: لا يوجد `prisma generate` ضمن lifecycle واضح

### التأثير

- fresh environments قد تعمل Nuxt بدون Prisma client generated بالشكل المتوقع

### المشكلة 3: الاعتماد الصريح على `vue-router`

### التأثير

- ليس خطأ مؤكدًا هنا
- لكنه package يستحق المراجعة لأن Nuxt يدير router داخليًا عادة

---

## 4. Recommended Fixes

## A. إصلاح سبب `dashboard 500` أولًا

### المطلوب

حماية جميع accesses غير المضمونة في template والـ computed.

### أمثلة

بدل:

```ts
order.id.slice(-8).toUpperCase()
```

استخدم:

```ts
(typeof order.id === 'string' ? order.id.slice(-8).toUpperCase() : 'N/A')
```

بدل:

```ts
order.totalAmount.toFixed(2)
```

استخدم:

```ts
Number(order.totalAmount ?? 0).toFixed(2)
```

### أيضًا

- sanitize `recentOrders`
- sanitize `stats`
- sanitize `lowStockProducts`

---

## B. اجعل dashboard أكثر أمانًا في SSR

### المطلوب

- لف منطق التحويل الحسابي في helpers/computed آمنة
- لا تعرض raw API data مباشرة في template

### مثال

إنشاء mapped array مثل:

```ts
const safeRecentOrders = computed(() =>
  (Array.isArray(orders.value) ? orders.value : []).slice(0, 5).map(order => ({
    id: typeof order.id === 'string' ? order.id : '',
    displayId: typeof order.id === 'string' ? order.id.slice(-8).toUpperCase() : 'N/A',
    totalAmount: Number(order.totalAmount ?? 0),
    userName: order.user?.name || 'Guest',
    status: order.status || 'UNKNOWN'
  }))
)
```

---

## C. إصلاح `server/api/admin/orders/[id].patch.ts`

### المطلوب

استخدم enum الصحيح من Prisma runtime.

### مثال آمن

```ts
import { OrderStatus } from '@prisma/client'

const validStatuses = Object.values(OrderStatus)
```

---

## D. إصلاح `server/api/auth/login.post.ts`

### المطلوب

- إما import صحيح لـ `logger`
- أو استخدام `console.error` مؤقتًا

### مثال

```ts
import { logger } from '../../utils/logger'
```

أو:

```ts
console.error('[Login Error]', error)
```

---

## E. إصلاح `server/api/auth/register.post.ts`

### المطلوب

إضافة import واضح لـ `prisma`.

### مثال

```ts
import prisma from '../../utils/prisma'
```

---

## F. إصلاح حذف المستخدم

### المطلوب

1. استبدال:
   - `currentUser.id`
   بـ:
   - `currentUser.userId`
2. تعديل schema أو منطق الحذف قبل delete

### الخيارات

- إما منع حذف المستخدم إذا كان لديه طلبات
- أو حذف/نقل الطلبات أولًا
- أو إضافة سياسة علاقة واضحة إذا كانت مناسبة للمنتج

---

## G. إصلاح seed route

### المطلوب

استبدال:

```ts
return createError(...)
```

بـ:

```ts
throw createError(...)
```

---

## H. نقل `bcrypt` إلى `dependencies`

### المطلوب

في `package.json`:

- نقل `bcrypt` من `devDependencies` إلى `dependencies`

---

## I. تحسين إدارة env/config

### المطلوب

- استخدام `runtimeConfig` في `nuxt.config.ts`
- تقليل الاعتماد المباشر على `process.env`

### الفائدة

- وضوح أكبر
- debugging أسهل
- سلوك أكثر ثباتًا بين dev/build/prod

---

## J. تحسين تشخيص الـ SSR

### المطلوب

- إضافة logging أوضح داخل dashboard data pipeline
- logging أوضح داخل auth plugin وmiddleware
- تغليف المقاطع الحساسة عند اللزوم

---

## 5. Priority Order

## 1. Critical

1. حماية render في `app/pages/admin/dashboard/index.vue`
2. إصلاح `server/api/auth/register.post.ts`
3. إصلاح `server/api/auth/login.post.ts`
4. إصلاح enum usage في `server/api/admin/orders/[id].patch.ts`

## 2. High

1. إصلاح self-check في `server/api/admin/users/[id].delete.ts`
2. معالجة حذف المستخدم المرتبط بطلبات
3. نقل `bcrypt` إلى `dependencies`
4. تقليل هشاشة auth flow بين plugin + middleware

## 3. Medium

1. تحسين `useApiFetch` typing/transform
2. إضافة `runtimeConfig`
3. تحسين logging في auth/middleware/dashboard
4. مراجعة `vue3-apexcharts` مع dev stability

## 4. Low

1. مراجعة dynamic Tailwind classes
2. تحسين دقة dashboard metrics مع pagination
3. تنظيف التعليقات المضللة وتوحيد error handling patterns

---

## 6. Final Action Plan

1. ابدأ بإصلاح `app/pages/admin/dashboard/index.vue`:
   - حماية `order.id`
   - حماية `order.totalAmount`
   - تحويل البيانات إلى safe mapped view model قبل العرض

2. أعد اختبار:
   - `http://localhost:3000/admin/dashboard`

3. إذا اختفى `500`:
   - يكون السبب الجذري غالبًا داخل SSR render للـ dashboard

4. بعدها أصلح backend issues المؤكدة بالترتيب:
   - `server/api/auth/register.post.ts`
   - `server/api/auth/login.post.ts`
   - `server/api/admin/orders/[id].patch.ts`
   - `server/api/admin/users/[id].delete.ts`

5. انقل `bcrypt` إلى `dependencies`

6. راجع Prisma deletion behavior للمستخدمين المرتبطين بطلبات

7. أضف logging أوضح للمسارات الحساسة:
   - auth
   - admin APIs
   - dashboard data fetching

8. بعد ذلك نفّذ اختبارًا وظيفيًا نهائيًا:
   - login
   - فتح `/admin/dashboard`
   - عرض الإحصائيات
   - فتح الطلبات
   - تحديث حالة طلب
   - حذف مستخدم

---

## 7. Final Verdict

### السبب الأرجح لخطأ `/admin/dashboard`

**SSR render crash داخل `app/pages/admin/dashboard/index.vue` بسبب افتراضات غير محمية على بيانات الطلبات.**

### هل توجد مشاكل أخرى مؤكدة؟

نعم، توجد عدة مشاكل مؤكدة في auth وadmin APIs ويجب إصلاحها حتى لو لم تكن السبب المباشر الحالي للـ dashboard error.

### الحكم النهائي على `IPC connection closed`

**هو عرض لاحق، وليس السبب الأصلي.**

السبب الأصلي الأقرب هو exception داخل execution path أعمق، وعلى رأسه dashboard SSR render أو route/server runtime failure.
