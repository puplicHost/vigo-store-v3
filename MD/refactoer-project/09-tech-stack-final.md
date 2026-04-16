# 09-Tech-Stack-Final.md

## Stability-first Recommendation (Exact Versions)

هذه النسخ تم اختيارها لأنها **مُثبتة/مستخدمة بالفعل** داخل Vigo Store v3 + Node LTS في 2026:

### Runtime

- **Node.js (LTS / Maintenance LTS)**: `v22.22.0`
- **Nuxt.js**: `4.4.2`
- **Vue**: `3.5.32`
- **Nitro (ships with Nuxt 4.4.2)**: `2.13.3` (internal to Nuxt)
- **Prisma**: `6.19.3`

### UI / Styling

- **TailwindCSS**: `3.4.19`
- **@nuxtjs/tailwindcss**: `6.14.0`

## Production-Stable Recommended Libraries (No “experimental”)

> القائمة أدناه هي التي تم الاعتماد عليها في المشروع الحالي أو بدائل بسيطة مستقرة.

- Auth / Tokens:
  - `jsonwebtoken` `9.0.3`
- Validation:
  - `zod` `4.3.6`
- Charts (Admin only, client-side):
  - `apexcharts` `5.10.0`
  - `vue3-apexcharts` `1.11.1`
- RBAC / i18n:
  - `@nuxtjs/i18n` `10.2.4`
- State management:
  - `pinia` `3.0.4`
  - `@pinia/nuxt` `0.11.3`
- Utilities:
  - `slugify` `1.6.9`
- Exports:
  - `xlsx` `0.18.5`

## Explicit “Avoid” Policy

- لا تستخدم Libraries غير SSR-safe مباشرة في server bundles.
- لا تستخدم queue frameworks جديدة بدون حاجة ومع ضمان نضجها.
- لا تعتمد على “latest” بدون تثبيت نسخه محددة في `package-lock.json`.

## Definition of Done

قبل بدء أي coding architecture refactor:

- تثبيت dependencies على نفس الـ versions في أي بيئة
- تأكيد أن:
  - `npm ci` ينتج نفس dependency tree
  - SSR routes لا crash بسبب package SSR incompatibility
