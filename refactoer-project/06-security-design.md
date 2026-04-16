# 06-Security-Design.md

## Security Objectives

- حماية endpoints عبر authentication + authorization + validation
- تقليل سطح الهجوم (attack surface) على SSR/Nitro
- توفير audit trail كامل لأعمال الأدمن (enterprise requirement)
- منع abuse عبر rate limiting

## JWT & Session Improvements

### 1) Token Strategy (Recommended)

اعتمد استراتيجية enterprise:

- **Access Token**: قصيرة العمر (5–15 دقيقة)
  - تستخدم للـ API calls
- **Refresh Token**: طويلة العمر (7–30 يوم)
  - مخزنة في cookie httpOnly
  - يتم rotation لكل refresh

### 2) Cookie Policy

- اجعل refresh token cookie:
  - `httpOnly: true`
  - `secure: true` في الإنتاج
  - `sameSite: strict/lax` حسب الحاجة
- تجنب `httpOnly: false` للـ access token في production.

### 3) CSRF Mitigation

إذا كان الـ token يُرسل تلقائيًا عبر cookies:

- استخدم CSRF token أو double-submit cookie approach
- أو اعتمد Authorization header للـ access token (أفضل عادةً)

### 4) JWT Secret Handling

قاعدة:

- لا ترمِ errors في **module load** عند غياب `JWT_SECRET`.
- بدلًا من ذلك:
  - تحقق من وجود JWT_SECRET في وقت request handling
  - أعِد error واضح (503 / 500 مع message عامة) بدل crash worker

هذا يحمي من حالات IPC/Nitro instability.

## RBAC Redesign (Policy-based)

### 1) Permission Engine

بدّل منطق RBAC المنتشر إلى “single RBAC engine”:

- `Role -> Permissions[]` mapping (managed in code)
- `Policy` يحدد:
  - من يملك permission المطلوبة
  - وهل المورد resource محدد يخصه (ownership)

### 2) Endpoint Policy Contract

كل endpoint يعلن metadata أو contract مثل:

- `requiredPermissions: [...]`
- `resourcePolicy: 'OWNED_BY_ACTOR' | 'ADMIN_ONLY' | 'GLOBAL'`

ثم middleware `permissions.ts`:

- يفحص actor context من auth middleware
- يطبق policy
- يمنع الوصول ويعيد error موحد بدون تفاصيل حساسة.

### 3) Admin Dashboard Security

لو dashboard يجمع data حساسة:

- implement “Dashboard policies”:
  - staff يقرأ read-only metrics محددة
  - SUPER_ADMIN لديه حق seed/export

## Rate Limiting (Redis-ready)

### 1) What to Rate Limit

- `/api/auth/login`
- `/api/auth/register`
- endpoints mutate data:
  - orders status patch
  - user delete/role update
  - exports (Excel/PDF)

### 2) Strategy

- استخدم token bucket أو sliding window
- Storage:
  - Redis-ready abstraction
  - في dev ممكن in-memory، لكن في prod يجب Redis

## Audit Logging (Enterprise Required)

### 1) When to Log

- كل عملية admin mutation:
  - update order status
  - delete/archive product
  - update user role
  - settings changes
  - seed/export actions

### 2) What to Log

- actor:
  - actorUserId
  - role
  - permissions snapshot (optional)
- target entity:
  - entityType
  - entityId
- actionType
- timestamp
- request context:
  - ip
  - user-agent
  - request-id correlation id
- metadata:
  - before/after (إن أمكن)

### 3) Consistency

- Audit log insertion يجب أن:
  - يكون best-effort ولا يوقف mutation إلا إذا كنت تريد strictness
  - يتم داخل نفس transaction إذا كان strict audit مطلوب.

## API Security Hardening

### 1) Validation Everywhere

- كل request body/query/params:
  - Zod schema
  - enum validation صارم
  - bounds على الأرقام (page/limit, amounts)

### 2) Output Filtering

- لا ترجع:
  - password hashes
  - tokens
  - internal prisma errors
- controllers تعتمد error mapper.

### 3) Error Message Strategy

- response errors:
  - `statusCode`
  - `statusMessage` العامة
  - `errorCode` ثابت (للتوثيق)
  - `details` ممكن فقط في dev

### 4) SSR/IPC Stability Security

- ممنوع استيراد browser-only packages في server bundles
- أي verify JWT أو Prisma initialization يجب أن:
  - لا يسبب unhandled rejection
  - يعود error controlled بدل crash

## Deliverable: Next Phase

الملف القادم `07-performance-scaling.md` يحدد:
- caching Redis-ready
- background jobs
- SSR optimization
- DB optimization
