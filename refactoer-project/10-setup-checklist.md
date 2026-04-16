# 10-Setup-Checklist.md

## 0) Pre-Flight Checks

- تأكد من وجود:
  - Node.js LTS مثبت (مُوصى به `v22.22.0`)
  - Docker Desktop running (للـ PostgreSQL)
  - قاعدة بيانات PostgreSQL accessible عبر `DATABASE_URL`

## 1) Docker Setup (PostgreSQL)

1. افتح `docker-compose.yml` في جذر المشروع.
2. تأكد من:
   - port mapping (مثل 5432)
   - user/password/db name
   - حجم data volume (لتجنب فقدان البيانات)
3. شغّل PostgreSQL:
   - `docker-compose up -d`
4. تحقق:
   - health check (إن وجد)
   - القدرة على اتصال Prisma/psql باستخدام نفس credentials

## 2) Environment Variables

1. انسخ `.env.example` إلى `.env` في الجذر.
2. حدّث القيم:
   - `DATABASE_URL="postgresql://<user>:<pass>@localhost:5432/<db>"`
   - `JWT_SECRET="change-me-in-production"`
   - `NODE_ENV="development"`
3. تأكد من عدم ترك:
   - JWT_SECRET placeholder
   - DATABASE_URL على host غير صحيح

## 3) Prisma Setup Steps

> الهدف: ensure schema sync + migration state + prisma client ready.

1. تثبيت dependencies:
   - `npm ci`
2. (اختياري لكن موصى) التأكد من generated client:
   - `prisma generate`
3. تطبيق migrations:
   - Development: `prisma migrate dev`
   - Production: `prisma migrate deploy`
4. Seed (إن كان لديك seed script):
   - نفّذ seed عبر script controlled (أفضل عبر Admin route أو CLI)

## 4) Nuxt Setup Steps

1. بعد تثبيت dependencies و migrations:
   - `nuxt prepare` (موجود عادةً عبر postinstall)
2. تشغيل dev server:
   - `nuxt dev`
3. تحقق من endpoints الأساسية:
   - `/api/settings`
   - `/admin/dashboard` (بعد تثبيت auth user + roles)

## 5) Installation Order (VERY IMPORTANT)

1. `docker-compose up -d` (PostgreSQL)
2. Copy `.env` (حِدث DATABASE_URL + JWT_SECRET)
3. `npm ci`
4. `prisma generate`
5. `prisma migrate dev` (أو deploy في prod)
6. `npm run dev` (أو `nuxt build && nuxt start` في prod)
7. Log in to admin + verify RBAC:
   - تأكد من وجود admin users (seed أو manual)

## 6) Production Checklist (Before deploy)

1. `NODE_ENV=production`
2. `JWT_SECRET` قوي + غير قابل للتخمين
3. database migrations مطبقة:
   - `prisma migrate deploy`
4. Build:
   - `nuxt build`
5. Start:
   - `nuxt start`
6. Ensure cache/queue env (إن طبقت caching/jobs):
   - Redis variables
   - Queue connection variables

## Definition of Done

- يستطيع مطور جديد تشغيل النظام بخطوات محددة دون تغيير يدوي غير مذكور.
- لا يظهر crash/500 على `/admin/dashboard` بعد build/refresh.
- API endpoints ترجع stable JSON حسب DTO contracts.
