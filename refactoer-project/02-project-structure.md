# 02-Project-Structure.md

## Design Principles

- **Domain-first**: folder structure is centered on business Domains, not file types.
- **Thin routes**: `app/pages/*` and `server/api/*` should only orchestrate request/response, delegating to services.
- **Single source of truth for types**: DTOs, Zod schemas, and error contracts live in `shared/`.
- **SSR safety by design**: all UI receives stable view models; no direct template access to raw API objects.
- **Testability**: services are framework-agnostic where possible; repositories can be mocked.

## Target Folder Layout (Enterprise-grade)

> ملاحظة: Nuxt يفرض أماكن محددة لـ `app/pages` و `server/api`. لذلك نُبقيها كـ “adapters” رقيقة، بينما المنطق الحقيقي ينتقل إلى `domains`.

```text
vigo-store-v3/
  app/
    pages/
      (router adapters)
        admin/
          dashboard/index.vue            -> calls AdminDashboard API client
          orders/index.vue              -> calls Orders API client
          ...
        store/
          index.vue
          products/[slug].vue
          cart.vue
          checkout.vue
    layouts/
      admin.vue                           -> UI shell only (no business logic)
      default.vue                         -> Store shell only
    domains/
      identity/
        components/
          AuthGate.vue
        composables/
          useAuthClient.ts
        stores/
          identityStore.ts               (Pinia)
      catalog/
        components/
          ProductCard.vue
          CategoryFilter.vue
        composables/
          useCatalogClient.ts
        stores/
          catalogStore.ts
      orders/
        components/
          OrdersTable.vue
        composables/
          useOrdersClient.ts
        stores/
          ordersStore.ts
      settings/
        components/
          CurrencyPicker.vue
        composables/
          useSettingsClient.ts
      admin/
        components/
          Breadcrumbs.vue
          NotificationsDropdown.vue
        composables/
          useAdminDashboardClient.ts
    components/
      (shared low-level components)
        ui/
          Button.vue
          Table.vue
          Modal.vue
          ToastHost.vue
    composables/
      (global composables)
        useTheme.ts
        useI18nSafe.ts
        useStableViewModel.ts
  server/
    api/
      (HTTP adapters)
        admin/
          dashboard.get.ts               -> calls AdminDashboardService
          orders/
            index.get.ts
            [id].patch.ts
          users/
            index.get.ts
            [id].patch.ts
            [id].delete.ts
        auth/
          login.post.ts                 -> calls AuthService
          register.post.ts             -> calls AuthService
          me.get.ts
        settings/
          index.get.ts                 -> calls SettingsService
    middleware/
      (Nitro middleware)
        auth.ts
        permissions.ts
        rate-limit.ts
        audit.ts
        maintenance.ts
    domains/
      identity/
        services/
          AuthService.ts
          RbacService.ts
        repositories/
          UserRepository.ts
          SessionRepository.ts
        validators/
          auth.validators.ts            (Zod)
        policies/
          admin.policies.ts
      catalog/
        services/
          CatalogService.ts
        repositories/
          ProductRepository.ts
          CategoryRepository.ts
        validators/
          catalog.validators.ts
      orders/
        services/
          OrdersService.ts
        repositories/
          OrderRepository.ts
          OrderQueryRepository.ts
        validators/
          orders.validators.ts
      settings/
        services/
          SettingsService.ts
        repositories/
          SettingsRepository.ts
        validators/
          settings.validators.ts
      admin/
        services/
          AdminDashboardService.ts
        queries/
          DashboardStatsQuery.ts       (optional CQRS query)
    shared/
      error/
        ErrorMapper.ts
        DomainError.ts
      dto/
        index.ts
      logging/
        logger.ts (structured)
      cache/
        CacheProvider.ts             (Redis-ready interface)
  shared/
    dto/
      OrdersDTO.ts
      AdminDashboardDTO.ts
      UsersDTO.ts
    validators/
      orders.validators.ts
      auth.validators.ts
    enums/
      Role.ts
      Permission.ts
      OrderStatus.ts
    errors/
      domain-errors.ts

  prisma/
    schema.prisma
    migrations/
  vigo-admin-api.json (Optional integration)
  docker-compose.yml
  nuxt.config.ts
  package.json
```

## How Adapters Connect to Domain Layer

### Server API Adapter Rules

- `server/api/**` يجب أن يكون “thin controllers”:
  - parse request body/query
  - call service
  - map service output DTO to response JSON
  - handle exceptions via ErrorMapper
- ممنوع وضع:
  - business rules
  - Prisma queries directly في `server/api/*`

### Frontend Route Adapter Rules

- `app/pages/**` يجب أن:
  - يعرض UI
  - ينادي “API client” من domain composables
  - يحافظ على SSR safety عبر view models

## Domain Contracts (DTO/ViewModel)

لمنع مشاكل مثل:

- SSR crash بسبب null/undefined
- hydration mismatch
- اختلاف shape API vs UI assumptions

اعتمد سياسة:

- Services ترجع **DTO** ثابت الشكل (no nulls for required fields).
- Frontend يحول DTO إلى **ViewModel** مناسب للعرض (formatting + fallback).
- UI templates لا تتعامل مع raw payload.

## What Changes From Current Project

- نقل معظم المنطق الموجود حاليًا داخل routes/middleware إلى:
  - `server/domains/*/services`
  - `server/domains/*/repositories`
  - `shared/validators` و `shared/dto`
- استبدال `useApiFetch` الحالي (المحول غير الموحد) عبر:
  - API clients domain-specific
  - validation/normalization ثابت

## Next Deliverable

الملف القادم `03-database-design.md` يحدد كيف تُحسن Prisma schema لدعم:

- consistency (cascades & constraints)
- audit logging
- indexing/pagination
- optional multi-tenant readiness
