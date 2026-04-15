Continue fixing Vigo Store. Now handle code quality issues:

### TASK 11 — Consolidate Permission Definitions
Create ONE shared file: shared/constants/permissions.ts

Move all ROLE_PERMISSIONS from these 3 files into it:
- app/composables/usePermissions.ts
- app/middleware/permissions.ts  
- server/utils/permissions.ts

Then import from the shared file in all 3 locations.

---

### TASK 12 — Add Zod Validation
Install: npm install zod

Create: server/utils/validators.ts

Add schemas for:
- LoginSchema: email (valid email), password (min 8 chars)
- RegisterSchema: name, email, password (min 8, uppercase, lowercase, number, special char)
- ProductSchema: name, description, price (positive), stock (non-negative), categoryId

Use in respective endpoints with:
  const result = Schema.safeParse(body)
  if (!result.success) throw createError({ statusCode: 400, statusMessage: result.error.issues[0].message })

---

### TASK 13 — Remove Console Logs
Files: app/layouts/admin.vue + all server API files

Remove all console.log() statements.
Replace any necessary logging with a proper logger utility:

Create: server/utils/logger.ts
  export const logger = {
    info: (msg: string, data?: any) => process.env.NODE_ENV !== 'production' && console.info(msg, data),
    error: (msg: string, err?: any) => console.error(msg, err) // keep errors
  }

---

### TASK 14 — Add Database Indexes
File: prisma/schema.prisma

Add indexes:
model Product {
  @@index([isDeleted, isActive])
  @@index([categoryId])
  @@index([createdAt])
}

model Order {
  @@index([status])
  @@index([userId])
  @@index([createdAt])
}

Then run: npx prisma migrate dev --name add_indexes

Show me the updated schema.