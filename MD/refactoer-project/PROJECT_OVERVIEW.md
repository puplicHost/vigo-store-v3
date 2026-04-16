# 📋 Vigo Store v3 - Project Overview

## 🎯 Project Description

**Vigo Store v3** is a modern, full-stack eCommerce platform built with **Nuxt 4**, **PostgreSQL**, and **Prisma ORM**. It provides a complete shopping experience with a customer-facing storefront and a professional admin dashboard for store management.

---

## 🏗️ Technology Stack

### Frontend
- **Framework:** Nuxt 4 (Vue 3)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Icons:** Material Symbols
- **Charts:** ApexCharts (vue3-apexcharts)
- **State Management:** Pinia
- **Internationalization:** @nuxtjs/i18n (English/Arabic)

### Backend
- **Server:** Nitro (Nuxt Server Engine)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Zod

### DevOps
- **Containerization:** Docker & Docker Compose
- **Version Control:** Git
- **Package Manager:** npm

---

## 📁 Project Structure

```
vigo-store-v3/
├── app/                          # Frontend application
│   ├── assets/                   # Static assets (CSS, images)
│   │   └── css/
│   │       └── main.css         # Global styles with premium UI classes
│   ├── components/               # Vue components
│   │   └── admin/               # Admin-specific components
│   │       ├── AdminTable.vue   # Reusable admin table
│   │       ├── AdminModal.vue   # Modal component
│   │       ├── StatusBadge.vue  # Status badge with icons
│   │       ├── EmptyState.vue   # Empty state component
│   │       └── SkeletonLoader.vue # Skeleton loading component
│   ├── composables/              # Vue composables (state management)
│   │   ├── useApiFetch.ts       # API fetch wrapper with auth
│   │   ├── useAuth.ts           # Authentication state
│   │   ├── usePermissions.ts    # RBAC permissions
│   │   ├── useSettings.ts       # Store settings
│   │   ├── useNotifications.ts  # Notification system
│   │   ├── useSearch.ts         # Search functionality
│   │   ├── useTheme.ts          # Theme (dark/light mode)
│   │   └── useDataRefresh.ts    # Data refresh logic
│   ├── layouts/                  # Page layouts
│   │   ├── admin.vue            # Admin layout with sidebar
│   │   └── default.vue          # Default layout
│   ├── middleware/               # Route middleware
│   │   ├── admin-guard.global.ts # Admin route protection
│   │   └── permissions.ts        # Permission-based access
│   ├── pages/                    # Page routes
│   │   ├── admin/                # Admin panel pages
│   │   │   ├── dashboard/        # Admin dashboard
│   │   │   ├── products/         # Product management
│   │   │   ├── categories/       # Category management
│   │   │   ├── orders/           # Order management
│   │   │   ├── users/            # User management
│   │   │   ├── settings/         # Store settings
│   │   │   └── notifications/    # Notification center
│   │   ├── auth/                 # Authentication pages
│   │   │   ├── login.vue
│   │   │   ├── register.vue
│   │   │   └── forgot-password.vue
│   │   ├── products/             # Customer product pages
│   │   ├── checkout/             # Checkout page
│   │   ├── maintenance.vue       # Maintenance mode page
│   │   ├── 403.vue              # Forbidden page
│   │   └── index.vue            # Homepage
│   ├── plugins/                  # Nuxt plugins
│   │   └── auth.ts              # Auth plugin
│   └── app.vue                   # Root component
├── server/                       # Backend server (Nitro)
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login.post.ts     # User login
│   │   │   ├── register.post.ts  # User registration
│   │   │   ├── logout.post.ts    # User logout
│   │   │   └── me.get.ts        # Get current user
│   │   ├── admin/                # Admin endpoints
│   │   │   ├── products/         # Product CRUD
│   │   │   ├── categories/       # Category CRUD
│   │   │   ├── orders/           # Order management
│   │   │   ├── users/            # User management
│   │   │   ├── settings/         # Store settings
│   │   │   ├── seed.post.ts      # Database seeding
│   │   │   ├── me.get.ts         # Current admin user
│   │   │   └── only.get.ts       # Admin-only check
│   │   ├── products/             # Public product endpoints
│   │   └── settings.get.ts       # Public settings
│   ├── middleware/               # Server middleware
│   │   ├── auth.ts              # JWT authentication
│   │   └── middleware.off/      # Disabled middleware
│   └── utils/                   # Utility functions
│       ├── admin.ts             # Admin helper functions
│       ├── logger.ts            # Logging utility
│       ├── prisma.ts            # Prisma client singleton
│       ├── rateLimiter.ts       # Rate limiting
│       └── validators.ts        # Zod validation schemas
├── prisma/                      # Prisma ORM
│   ├── schema.prisma            # Database schema
│   ├── migrations/              # Database migrations
│   └── seed.ts                  # Database seeding
├── i18n/                        # Internationalization
│   └── locales/
│       ├── en.json              # English translations
│       └── ar.json              # Arabic translations
├── public/                      # Public static files
├── shared/                      # Shared utilities
│   └── constants/
│       └── permissions.ts       # RBAC permissions
├── Phases/                      # Project documentation
│   ├── premium-admin-ui-plan.md # Admin UI enhancement plan
│   └── ipc-connection-closed-debug-report.md # Debug report
├── .env                         # Environment variables
├── .env.example                # Environment variables template
├── docker-compose.yml           # Docker services
├── nuxt.config.ts              # Nuxt configuration
├── tailwind.config.ts          # TailwindCSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies

```

---

## 🗄️ Database Schema

### Models

#### User
- **Fields:** id, name, email, password, image, role, createdAt, updatedAt
- **Roles:** USER, SALES, MANAGER, ADMIN, SUPER_ADMIN
- **Relations:** hasMany Orders

#### Product
- **Fields:** id, name, slug, description, price, discount, images, sizes, colors, stock, isFeatured, isDeleted, isActive, deletedAt, categoryId, createdAt, updatedAt
- **Relations:** belongsTo Category, hasMany OrderItems

#### Category
- **Fields:** id, name
- **Relations:** hasMany Products

#### Order
- **Fields:** id, userId, totalAmount, status, paymentStatus, paymentIntentId, transactionId, createdAt, updatedAt
- **Statuses:** PENDING, PAID, SHIPPED, DELIVERED, CANCELLED
- **PaymentStatuses:** PENDING, PAID, FAILED, REFUNDED
- **Relations:** belongsTo User, hasMany OrderItems

#### OrderItem
- **Fields:** id, orderId, productId, quantity, price
- **Relations:** belongsTo Order, belongsTo Product

#### Settings (Singleton)
- **Fields:** shippingFee, freeShippingThreshold, currency, contactEmail, contactPhone, contactAddress, whatsappNumber, maintenanceMode, maintenanceMessage, siteName, siteDescription, siteKeywords, social media URLs, payment settings

#### RolePermission
- **Fields:** id, role, permission
- **Purpose:** RBAC system linking roles to permissions

---

## 🔐 Authentication & Authorization

### Authentication Flow
1. **Login:** User submits credentials → Server validates → JWT token generated → Token stored in cookie (httpOnly: false for SPA)
2. **Registration:** User creates account → Password hashed with bcrypt → User created in database
3. **Session Persistence:** Token stored in cookie with 7-day expiration
4. **Logout:** Cookie cleared → User state reset

### Authorization (RBAC)
- **Roles:** USER, SALES, MANAGER, ADMIN, SUPER_ADMIN
- **Permissions:** Granular permissions (VIEW_PRODUCTS, CREATE_PRODUCTS, EDIT_PRODUCTS, DELETE_PRODUCTS, VIEW_ORDERS, UPDATE_ORDER_STATUS, VIEW_USERS, MANAGE_USERS, MANAGE_SETTINGS, VIEW_CATEGORIES, MANAGE_CATEGORIES)
- **Role-Permission Matrix:** Each role has predefined permissions
- **SUPER_ADMIN:** Bypasses all permission checks
- **Middleware:** Route-level protection with `admin-guard.global.ts` and `permissions.ts`

---

## 🛒 eCommerce Features

### Customer Features
- **Product Browsing:** View products by category, search products
- **Product Details:** View product images, sizes, colors, price, stock
- **Shopping Cart:** Add to cart, update quantity, remove items, cart persistence (localStorage)
- **Checkout:** Place order, COD payment option
- **Order Tracking:** View order status
- **User Account:** Register, login, view order history

### Admin Features
- **Dashboard:** KPI cards, revenue charts, order status distribution, recent orders, low stock alerts
- **Product Management:** Full CRUD, image upload, size/color variants, stock tracking, featured products
- **Category Management:** Full CRUD
- **Order Management:** View orders, update status, filter by status, export to Excel
- **User Management:** View users, assign roles, delete users
- **Settings:** Store configuration (shipping, payment, contact info, SEO, social media, maintenance mode)
- **Notification Center:** View system notifications
- **Database Seeding:** Seed demo data (users, products, categories, orders)

---

## 🎨 UI/UX Features

### Premium Admin UI
- **Dark Mode:** Full dark mode support with CSS variables
- **Responsive Design:** Mobile-friendly with drawer sidebar
- **Premium Components:** 
  - AdminTable (sorting, pagination, bulk actions)
  - StatusBadge (with icons)
  - AdminModal (backdrop blur, animations)
  - EmptyState (type-based styling)
  - SkeletonLoader (multiple types)
- **Glass Surface:** Glassmorphism effects
- **Animations:** Stagger animations, smooth transitions
- **Custom Scrollbars:** Styled scrollbars

### Customer UI
- **Modern Design:** Clean, minimalist interface
- **Responsive:** Mobile-first design
- **RTL Support:** Arabic language support with RTL layout
- **Product Cards:** Image, price, stock indicators
- **Cart Drawer:** Slide-out cart
- **Checkout Flow:** Multi-step checkout

---

## 🔧 Configuration

### Environment Variables
```env
DATABASE_URL=postgresql://user:password@localhost:5432/vigo_store
JWT_SECRET=your-secret-key
```

### Nuxt Configuration
- **SSR:** Enabled (disabled on dashboard to prevent IPC errors)
- **Modules:** TailwindCSS, i18n, Pinia
- **Auto-imports:** Components, composables, utilities
- **Runtime Config:** Database URL, JWT secret

### Tailwind Configuration
- **Theme:** Custom theme with CSS variables
- **Colors:** Primary, secondary, success, warning, error, info
- **Dark Mode:** Class-based dark mode
- **Custom Classes:** card-premium, glass-surface, animate-stagger, scrollbar-custom

---

## 🚀 Deployment

### Development
```bash
npm install
npm run dev
```

### Production
```bash
npm run build
npm run start
```

### Docker
```bash
docker-compose up -d
```

### Database
```bash
npx prisma migrate dev
npx prisma seed
```

---

## 📊 Current Status

### Completed Features ✅
- User authentication (JWT)
- Product CRUD
- Category CRUD
- Order management (view, update status)
- User management (view, assign roles)
- Store settings
- Basic dashboard with charts
- Premium admin UI components
- Dark mode support
- Responsive sidebar
- RBAC system
- Cart functionality
- Checkout flow

### In Progress 🔄
- Enterprise-level features (per gap analysis)
- Advanced analytics
- Order fulfillment workflow
- Inventory management
- Customer CRM
- Audit logging system

### Known Issues ⚠️
- **IPC Connection Closed:** Fixed by disabling SSR on dashboard
- **Missing Imports:** Fixed in auth routes
- **Enum Validation:** Fixed in orders API
- **User Deletion:** Fixed to prevent cascade issues

---

## 🎯 Future Roadmap

### Phase 1: Foundation (Completed)
- Fix critical bugs
- Implement premium UI
- Add responsive design

### Phase 2: Enterprise Features (Planned)
- Service layer abstraction
- Modular architecture
- Audit logging
- Advanced analytics
- Order fulfillment
- Inventory management
- Customer CRM

### Phase 3: Scalability (Planned)
- Caching layer (Redis)
- Background job processing
- Real-time features (WebSocket)
- API rate limiting
- Advanced security

### Phase 4: Enhancements (Planned)
- Advanced table features
- Document management
- Plugin/integration system
- Multi-tenancy support

---

## 👥 Team & Roles

### Development Team
- **Frontend:** Vue 3, Nuxt 4, TailwindCSS
- **Backend:** Nitro, Prisma, PostgreSQL
- **DevOps:** Docker, CI/CD

### User Roles
- **SUPER_ADMIN:** Full system access
- **ADMIN:** Products, categories, orders management
- **MANAGER:** Products and orders (no user management)
- **SALES:** Orders only (view and update status)
- **USER:** Customer access only

---

## 📝 Documentation

- **Premium Admin UI Plan:** `Phases/premium-admin-ui-plan.md`
- **Debug Report:** `Phases/ipc-connection-closed-debug-report.md`
- **Gap Analysis:** `dashboard-gap-analysis.md`
- **API Documentation:** Inline code comments
- **Database Schema:** `prisma/schema.prisma`

---

## 📧 Contact & Support

- **Project:** Vigo Store v3
- **Version:** 3.0
- **Status:** Active Development
- **License:** Private

---

**Last Updated:** April 16, 2026  
**Maintained by:** Development Team
