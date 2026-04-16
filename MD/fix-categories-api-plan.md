# Fix Plan: Admin Categories API `500` Error

## 1. Problem Summary

- صفحة الأدمن الخاصة بـ Categories في الواجهة الأمامية تفشل لأنها تقوم بتحميل:
  - `GET /api/admin/categories`
- في المتصفح تظهر رسالة:
  - `500 Internal Server Error`
  - `Failed to fetch categories`
- كما تظهر في السجل/الكونسول رسالة مُغلّفة من خلال H3:
  - `[API ERROR] admin-categories-list: H3Error: [GET] "/api/admin/categories": 500 Failed to fetch categories`
- ملاحظة مهمة:
  - تحذيرات i18n مثل مفاتيح مفقودة (مثل `dashboard.orders.pending`) **ليست السبب الحقيقي** لسبب الـ `500`.
  - السبب الحقيقي يجب البحث عنه في **سجلات سيرفر Nuxt/Nitro** لأن `H3Error` هنا مجرد “wrapper” للخطأ.

## 2. Immediate Debugging Steps

### Step 1: شغّل السيرفر في وضع واضح للأخطاء

1. تأكد أن Postgres شغّال عبر Docker.
2. نفّذ:

```bash
npm run dev
```

### Step 2: جرّب endpoint مباشرة خارج الواجهة الأمامية

1. افتح المتصفح أو Postman/Insomnia إلى:

```http
http://localhost:<port>/api/admin/categories
```

2. إذا تستخدم Admin endpoint يحتاج JWT/RBAC:
   - تأكد أن الكوكي/Authorization header موجود.
   - سجل الـ response status و response body بالكامل (حتى لو كان JSON error).

### Step 3: اربط الـ error الحقيقي بالطلب

1. أثناء تنفيذ الخطوة السابقة، راقب:
   - نافذة طرفية `nuxt dev` (Nitro logs)
   - أي logs مخصصة في `server/shared/error/ErrorMapper.ts` أو logger
2. استخرج:
   - أول stack trace حقيقي يظهر وقت وقوع `500`
   - اسم الملف/السطر الذي بدأ منه exception قبل wrapper الخاص بـ H3

### Step 4: تأكد أن الواجهة لا تعمل retries/duplicated calls

- بعض صفحات Nuxt قد تعمل أكثر من call (SSR + client hydration).
- افحص network tab:
  - هل `GET /api/admin/categories` يتم استدعاؤه مرتين؟
  - هل أحد الاستدعاءات يفشل بسبب missing auth cookie على client؟

## 3. Files to Inspect (What to verify in each file)

> الهدف: الوصول للسبب الجذري داخل السيرفر عبر التحقق من flow:
> **API Route -> Service -> Repository -> Prisma -> ErrorMapper -> Response**

### 3.1 `server/api/admin/categories.get.ts`

تحقق من التالي:

- هل الـ route export صحيح (اسم handler / default export)?
- هل route يستدعي service الصحيح بعد refactor؟
- هل route يقوم بعمل `try/catch` أم يعتمد على ErrorMapper؟
- هل route يعيد الاستجابة بصيغة متوافقة (JSON shape ثابت) مع ما تنتظره صفحة Categories؟
- هل يتم استدعاء dependencies (logger/service) بشكل صحيح؟
- هل route يملك `middleware`/RBAC يسبب exception/redirect غير مصرح؟

مخرجات مطلوبة:
- يجب وجود stack trace واضح في حالة فشل route.
- لو الـ route “يبتلع” error بدون details، انتقل مباشرة للخطوة 5 في قسم Logging improvements.

### 3.2 `server/domains/catalog/services/CategoryService.ts`

تحقق من التالي:

- هل method المستخدمة في route موجود فعلًا بنفس الاسم والتوقيع؟
  - مثال: `listCategories`, `getCategories`, `adminListCategories`…
- هل CategoryService يعتمد على repository واحد/أكثر بالطريقة الصحيحة؟ (constructor injection صحيح)
- هل service يقوم بعمل normalization/DTO mapping؟
  - هل يرجع DTO ثابت الشكل حتى في حالة Empty results؟
- هل service يرمّي errors من نوع domain errors (ثم ErrorMapper يحوّلها) أم يرمّي errors خام؟
- هل service يستخدم caching layer بطريقة صحيحة؟
  - إن كانت cache تُرجع `null/undefined` فقد يؤدي ذلك لخطأ لاحق في response mapping.

مخرجات مطلوبة:
- service يجب أن يضمن DTO shape stable أو يرمي domain error قابل للتحويل.

### 3.3 `server/domains/catalog/repositories/CategoryRepository.ts`

تحقق من التالي:

- هل repository method يستدعي Prisma query الصحيح؟
  - `prisma.category.findMany(...)` أو ما شابه
- هل select/include يتوافق مع DTO المتوقع في service؟
- هل يوجد error محتمل:
  - Prisma init failure
  - schema mismatch
  - enum/value mismatch (لو يوجد filter/enums)
- هل repository يستخدم `prisma` instance الصحيح؟
  - import صحيح لـ `server/utils/prisma`
  - عدم إنشاء Prisma client بشكل متكرر (قد يسبب مشاكل في بعض البيئات)
- هل repository يقبل filters/pagination بشكل صحيح؟
  - page/limit bounds
  - default sort stable

مخرجات مطلوبة:
- repository لا يجب أن يُرجع shape غير متوقع.
- أي Prisma error يجب أن يمر عبر service/ErrorMapper وليس يخرج كـ 500 غير مُحدد.

### 3.4 `server/shared/error/ErrorMapper.ts`

تحقق من التالي:

- هل ErrorMapper يطابق error types؟
  - DomainError vs Prisma error vs generic Error
- هل ErrorMapper يوفر:
  - `statusCode`
  - `statusMessage`
  - optional `errorCode` / `details` (تفصيلي فقط في dev)
- هل ErrorMapper يطبع logs قبل تحويل error؟
- هل ErrorMapper قد “يبتلع” message الأصلي ويستبدله بـ generic 500؟
  - في هذه الحالة، يجب إضافة logging مؤقت كما في القسم 5.

مخرجات مطلوبة:
- حتى لو واجهة تعيد `Failed to fetch categories`، الـ server logs يجب أن تكشف “المصدر الحقيقي”.

## 4. Likely Root Causes (Detailed checks)

### A) خطأ import/export بعد refactor

- التحقق:
  - هل اسم الملف/الكلاس صحيح؟
  - هل الـ service instance في route هو instance فعلي وليس undefined؟
- أعراض:
  - exception مثل `Cannot read properties of undefined`
  - أو `TypeError: <method> is not a function`

### B) Repository method مفقودة/renamed

- التحقق:
  - هل route/service تستدعي method باسم قديم؟
  - تأكد من signatures.
- أعراض:
  - `CategoryRepository.<method> is not a function`

### C) Dependency injection غير معرف (undefined dependency)

- التحقق:
  - إذا CategoryService يعتمد على repository في constructor، هل يتم تمريره؟
- أعراض:
  - `Cannot read properties of undefined` أثناء استدعاء repository/prisma

### D) DTO shape mismatch

- التحقق:
  - هل CategoryRepository select fields تختلف عن DTO schema المتوقع؟
  - هل يوجد transformation في service قد تسقط حقول؟
- أعراض:
  - crash داخل service DTO mapping أو ErrorMapper بسبب undefined properties

### E) Prisma query failure

- التحقق:
  - DB connection
  - schema migration state
  - env `DATABASE_URL` صحيح
- أعراض:
  - PrismaClientInitializationError / query errors

### F) ErrorMapper swallowing useful details

- التحقق:
  - هل ErrorMapper يسوي `createError({ statusCode: 500, message: '...' })` بدون logging?
- أعراض:
  - frontend فقط يرى generic 500 بدون أي hints
  - ولكن stack trace يظهر في server logs فقط إذا كان هناك logging قبل swallow

### G) Caching layer returning invalid cache value

- التحقق:
  - لو caching ينفّذ `JSON.parse` على قيمة غير JSON.
  - أو يرجع `null` لـ DTO required.
- أعراض:
  - exception من JSON.parse أو property access.

### H) Auth/RBAC causing exception instead of controlled redirect

- التحقق:
  - هل categories route محمي ويقوم guard برمي exception؟
  - الأفضل أن يكون behavior:
    - 401/403 JSON error أو redirect واضحة
  - وليس 500.

## 5. Logging Improvements (Temporary debug logs)

> الهدف: الحصول على first real exception location بسرعة.
> لا تنسَ إزالة/تقليل logs بعد حل المشكلة.

### Step 1: أضف log داخل route

داخل `server/api/admin/categories.get.ts` أضف مؤقتًا قبل وبعد كل call:

```ts
console.log('[admin/categories] route hit')
console.log('[admin/categories] calling service...')
```

ثم في catch أو بعد call:

```ts
console.log('[admin/categories] service returned', { count: categories?.length })
```

### Step 2: أضف log داخل CategoryService

```ts
console.log('[CategoryService] listCategories called')
console.log('[CategoryService] repository instance?', !!this.categoryRepository)
```

قبل/بعد mapping للـ DTO:

```ts
console.log('[CategoryService] raw result sample', categories?.[0])
```

### Step 3: أضف log داخل CategoryRepository

```ts
console.log('[CategoryRepository] findMany categories...')
```

وبعد Prisma call:

```ts
console.log('[CategoryRepository] prisma result count', result?.length)
```

### Step 4: log حول ErrorMapper input

في `server/shared/error/ErrorMapper.ts`:

- log لنوع error:
  - `error.name`
  - `error.message`
  - وفي dev: `stack`

مثال:

```ts
console.error('[ErrorMapper] mapping error', {
  name: error?.name,
  message: error?.message
})
```

## 6. Validation Checklist

ضع checklist عند كل محاولة بعد تعديل logging أو code:

- [ ] `GET /api/admin/categories` يعود `200` عند اختبارها مباشرة في المتصفح/Postman
- [ ] payload shape ثابت ومتوافق:
  - قائمة categories لها حقول متوقعة (مثل `id`, `name`, ... حسب contract)
- [ ] لا يوجد stack trace جديد غير مُفسر في terminal وقت request
- [ ] لا توجد request مكررة غير لازمة تسبب race (SSR + hydration بدون auth cookie)
- [ ] إذا endpoint محمي:
  - auth cookie/headers موجودة في call الحقيقي
- [ ] لا توجد exceptions داخل DTO mapping أو computed في service
- [ ] ErrorMapper يعيد error JSON مفيد عند الفشل (dev)

## 7. Translation Warnings Cleanup (Cleanup only)

تحذيرات i18n (missing keys) مثل:

- `dashboard.orders.pending`
- `dashboard.orders.paid`
- `dashboard.orders.shipped`

هذه ليست سبب `500` في API.

لكن بعد إصلاح API:

- أضف المفاتيح الناقصة في:
  - `i18n/locales/en.json`
  - و/أو `ar.json` إذا كانت مطلوبة حسب اللغة الافتراضية.
- تأكد من أسماء المفاتيح match حرفيًا لما تستخدمه UI.

هذه خطوة “تجميلية/UX” فقط لضمان نظافة logs وعدم تشتيت فريق التطوير.

## 8. Final Refactor Recommendation

عشان يتوافق مشروع refactor Enterprise و يقل خطر تكرار نفس المشكلة:

1. **مهاجرة categories endpoint لنفس نمط dashboard endpoint**:
   - service + repository
   - DTO mapping ثابت
   - domain errors + ErrorMapper
2. “Typed DTOs”:
   - لا return raw prisma entities مباشرة
   - استخدم contracts محددة.
3. “Consistent error handling contract”:
   - أي exception لازم يمر عبر domain error mapper.
4. **Integration tests**:
   - اكتب tests تتأكد أن:
     - `/api/admin/categories` يرد `200` مع بيانات seed
     - يرد `401/403` عند غياب auth
     - يرد error JSON صحيح عند failure (DB down / Prisma error)
5. Add SSR safety rule:
   - حتى لو API فشل: UI يعرض empty/error state بدل crash.

---

## Suggested Deliverable after Fix

- screenshot/record لـ server stack trace الأصلي قبل الإصلاح (للتوثيق)
- بعد الإصلاح:
  - confirmation أن endpoint يرجع `200`
  - network call payload مطابق للـ frontend expectation
  - إزالة أو تقليل logs مؤقتة
