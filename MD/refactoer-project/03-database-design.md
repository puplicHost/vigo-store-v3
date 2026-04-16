# 03-Database-Design.md

## Design Objectives

- **Consistency**: منع حالات الـ orphan data و constraint failures.
- **Auditability**: حفظ سجل واضح لكل تغييرات الإدارة.
- **Query Performance**: تقليل join cost وتحسين indexes حسب أنماط الاستعلام.
- **Scalability**: دعم بيانات كبيرة مع pagination ثابت.
- **Multi-Tenant Readiness (Optional)**: جاهزية لاحقة لإضافة tenants دون إعادة كتابة كاملة.

## Current Observations (From Existing Schema)

- `Product` يستخدم `images String[]` و `sizes String[]` و `colors String[]`
  - مناسب كبداية
  - لكنه يصبح أقل مرونة للاستعلامات المعقدة (search/filter/sorting) وللتدقيق.
- `Order.user` بدون سياسة cascade واضحة في schema
  - deletion behavior قد يولد errors في admin delete routes.
- لا توجد table واضحة لـ `audit logging`
  - مما يصعّب enterprise-level support.

## Target Prisma Schema (Conceptual Improvements)

### 1) Introduce Shared Identifiers & Audit Fields

أضف حقول audit موحدة على أغلب الجداول:

- `createdAt`, `updatedAt` (موجودة جزئيًا)
- `createdById` / `updatedById` (اختياري لكن مهم للأدمن)
- `tenantId` (اختياري للمستقبل)

### 2) Normalize Product Media for Scale

بدل `images String[]`:

- استخدم model مثل `ProductImage`:
  - `id`, `productId`
  - `url`
  - `altText` (اختياري)
  - `position` (للترتيب)
  - `createdAt`

الفوائد:

- تحسين فرز/عرض الصور
- دعم deletion/manage per image
- مستقبلًا ربط مع storage provider (S3/Cloudinary) بشكل أكثر وضوحًا

### 3) Normalize Variants (Optional, Roadmap)

بدل `sizes: String[]` و `colors: String[]`:

- `Variant` أو `OptionGroup`:
  - `Size`, `Color`
  - ثم جدول الربط `ProductOption` أو `ProductVariant`

هذا يقوي:

- stock per variant
- bulk price/stock edits

> إذا كان الهدف في refactor الحالي هو الاستقرار فقط: اترك arrays مؤقتًا، لكن خطط للـ normalization في مرحلة لاحقة.

### 4) Make Order & Payment Explicit

حاليًا:

- `Order.paymentStatus`
- `Order.paymentIntentId` / `transactionId`

للتحسين enterprise:

- أضف model `Payment` (اختياري):
  - `orderId`
  - `provider` (stripe/cod/etc)
  - `status`
  - `intentId`
  - `transactionId`
  - `amount`, `currency`

أو أبقِ الحالية لكن:

- اجعل indexes على `paymentStatus`, `createdAt`
- وثق enum transitions داخل service layer

### 5) Audit Log Table (Required for Admin Enterprise)

أضف:

- `AuditLog`
  - `id`
  - `tenantId` (optional)
  - `actorUserId` (admin/staff)
  - `actionType` (مثل: `ORDER_STATUS_UPDATED`, `USER_DELETED`, `SETTINGS_UPDATED`)
  - `entityType` (ORDER/PRODUCT/USER/SETTINGS)
  - `entityId`
  - `metadata` (jsonb payload)
  - `createdAt`

ملاحظة:

- `metadata` تسمح بتخزين قبل/بعد diff أو request context بشكل مرن.

### 6) Referential Integrity & Cascade Policy

اختر سياسة موحدة:

- **Option A (Safer for production)**: enforce `RESTRICT` on deletions + use soft delete
  - يمنع constraint failures
  - يضمن أن `orders` لا تختفي
- **Option B**: add cascade deletes where it is semantically correct
  - مثال: `OrderItem` يمكن أن يكون cascade مع `Order`

في مشروع eCommerce enterprise غالبًا:

- لا تحذف Orders فعلًا (soft delete أو immutable)
- تحذف/تعطل products عبر `isActive/isDeleted` أو عبر archive

لذلك أوصي:

- لا تعتمد cascade على `User` حذفًا
- بدلاً من ذلك:
  - يمنع حذف user إذا لديه orders، أو
  - ينقل orders إلى “Deleted User placeholder” (معالجة أخلاقية/منتج)

### 7) Indexing Strategy (Performance)

اعتمد indexes على patterns:

- `Order(status, createdAt desc)`
- `Order(userId, createdAt desc)`
- `Product(isDeleted, isActive, createdAt desc)`
- `Product(categoryId)`
- `Category(name)`
- `Settings(tenantId?)` unique constraint إن لزم

كما أضف composite indexes للبحث admin:

- Orders: search often by `id` prefix, `user.name` (ينصح بنتائج denormalization أو search cache)
- Users: `role`, `createdAt`

### 8) Multi-Tenancy Readiness (Optional)

جاهزية tenants بدون microservice:

- أضف `tenantId` إلى:
  - User, Product, Category, Order, Settings, AuditLog
- اجعل معظم الـ unique constraints composited:
  - `unique(tenantId, email)`
  - `unique(tenantId, slug)`
  - `unique(tenantId, categoryName)`

طبّق Query filters على repositories:

- كل Repository يستقبل `tenantId` من auth context
- لا يوجد “نسيان filter” عبر architecture: repository base class يجبر هذا

## Migration Strategy (Database)

اقتراح مراحل:

1. First: add AuditLog model + indexes without changing current product arrays.
2. Second: adjust cascade policy / deletion rules to remove admin delete instability.
3. Third (optional): normalize product images and variants.
4. Fourth: multi-tenant optional extension.

## Definition of Done

تعتبر قاعدة البيانات enterprise-ready عندما:

- Admin deletions لا تولد 500/constraint crashes تحت سيناريوهات واقعية.
- endpoints تعود بوقت ثابت تقريبًا تحت load.
- dashboard queries تستفيد من indexes (explain analyze done).
- audit log يعكس تغييرات الأدمن بدقة.
