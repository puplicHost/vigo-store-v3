# 05-Frontend-Architecture.md

## Objectives

- فصل Store UI عن Admin UI بالكامل من ناحية البيانات والصلاحيات.
- منع SSR crashes عبر:
  - ViewModel mapping
  - stable DTO contracts
  - consistent error/loading/empty states
- بناء component system قابل للتوسع مثل Shopify admin.

## Nuxt 4 Redesign (High-Level)

### 1) Route Adapters

- `app/pages/store/*`:
  - صفحات المتجر: SSR preferred مع hydration.
  - تعتمد على API clients خاصة بالـ Store domains.
- `app/pages/admin/*`:
  - صفحات الأدمن: SSR/CSR hybrid مع RBAC gating.
  - تعتمد على Admin API clients.

### 2) Layouts

- `layouts/default.vue` (Store shell):
  - header/footer, cart summary, i18n dir handling
  - لا يحتوي أي business logic
- `layouts/admin.vue` (Admin shell):
  - sidebar/topbar/notifications/toast host
  - يحتوي:
    - auth gate UI
    - theme + direction toggles
  - لا يحتوي:
    - API aggregation logic
    - Prisma-related assumptions

## Component System Design (Domain UI)

اعتمد Component taxonomy:

1. **Domain Components (app/domains/<domain>/components)**
   - `ProductCard`, `OrdersTable`, `CategoryFilter`, `AdminBreadcrumbs`
   - مسؤولياتهم UI فقط
2. **UI Primitives (app/components/ui)**
   - `Button`, `Modal`, `ToastHost`, `Table`, `Input`, `Select`
   - قابلة لإعادة الاستخدام عبر كل المجالات
3. **Page-level Composition**
   - `app/pages/admin/dashboard/index.vue` يجمع Widgets من domain components
   - يمرر ViewModels فقط

## ViewModel Strategy (Critical for SSR Stability)

### لماذا ViewModels؟

لتجنب crash مثل:

- `order.id.slice(...)`
- `totalAmount.toFixed(...)`

عند اختلاف type/shape.

### القاعدة

- أي data قادمة من API client يتم transformها إلى ViewModel:
  - IDs: string normalization
  - numbers: `Number(value ?? 0)`
  - enums: fallback `UNKNOWN`
  - missing nested objects: fallback to empty objects

النتيجة:

- templates تعمل دائمًا على بيانات آمنة
- يقل احتمال SSR 500 و IPC disconnect

## Data Fetching Architecture

### 1) API Clients per Domain

إنشاء layer بسيط:

- `app/domains/orders/composables/useOrdersClient.ts`
- `app/domains/admin/composables/useAdminDashboardClient.ts`

هذا layer:

- يستدعي server endpoints
- يعرف contracts
- يعيد normalized DTOs أو مباشرة ViewModels

### 2) SSR/Client boundaries

- Charts / DOM-only libs:
  - داخل `ClientOnly`
  - أو lazy-load عبر dynamic import
- DOM APIs:
  - داخل `onMounted`
  - أو guard بـ `process.client`

## State Management Strategy (Pinia)

### Rule: Server State vs UI State

- **Server State** (authenticated user, lists, dashboard stats):
  - يُفضّل fetch مع `useAsyncData`/API client
  - أو store يعتمد على actions للتحميل
  - يجب أن يدعم SSR caching
- **UI State** (modals open/close, sidebar collapsed, selected filters):
  - Pinia مناسب جدًا
  - لا يعتمد على SSR DOM

### Pinia Modules (Per Domain)

أنشئ stores لكل domain:

- `identityStore` (auth user, loading, roles)
- `catalogStore` (categories, products cache)
- `ordersStore` (recent orders, orders lists)
- `settingsStore` (currency, shipping)
- `adminUiStore` (global UI states: dropdown open, search query)

### Avoiding Hydration Mismatch

- أي state يعتمد على runtime browser-only values يجب:
  - يكون `ClientOnly`
  - أو يُبنى بعد mounted
  - أو يحتفظ fallback ثابت أثناء SSR

## Error Handling UX Standardization

كل domain widget يجب أن يوفر:

- Loading skeleton
- Empty state (no data)
- Error state (message + retry)

بدل ترك UI تتعطل بسبب exceptions.

## Security & RBAC on Frontend

لممنع flicker:

- middleware route guard يحجب الوصول/يريد redirect
- Admin UI يعرض فقط what user can view

لكن:

- يعتبر Frontend مجرد UX
- المصدر الحقيقي للحماية دائمًا backend policies

## Deliverable: Next Phase

الملف القادم `06-security-design.md` يحدد:
- JWT architecture
- RBAC/policy engine
- rate limiting
- audit logging
- API hardening patterns
