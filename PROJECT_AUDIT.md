# PROJECT_AUDIT.md — BODHIQ Platform

> **Stack:** Next.js 15 (App Router) + FastAPI + SQLite → PostgreSQL
> **Auth:** Clerk | **Payments:** Razorpay | **Audited:** June 2026

---

## 1. FEATURE INVENTORY

### Public-Facing Pages

| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Hero + Philosophy + Featured Collection |
| Collection | `/collection` | All categories with nested products |
| Category | `/collection/[category]` | Single category with all products |
| Product | `/product/[slug]` | Full product detail (images, video, specs, cart/notify) |
| Dynamic CMS | `/[slug]` | Generic CMS-driven content pages |
| Cart | `/cart` | Cart review before checkout |
| Checkout Address | `/checkout/address` | Shipping address collection |
| Checkout Payment | `/checkout/payment` | Razorpay payment initiation |
| Checkout Success | `/checkout/success` | Order confirmation |
| Account Hub | `/account` | User account navigation hub |
| Account Profile | `/account/profile` | Clerk user profile |
| Account Orders | `/account/orders` | Order history + invoice generation |
| Account Address | `/account/address` | Manage saved shipping addresses |
| Account Payment | `/account/payment` | Saved payment methods (placeholder) |
| Account Support | `/account/contact` | Support contact |
| About | `/about` | Brand story |
| Craftsmanship | `/craftsmanship` | Manufacturing/quality |
| Values/Philosophy | `/values` | Brand values |
| Knowledge | `/knowledge` | Watch education |
| Track Order | `/track-order` | Order tracking |
| Download App | `/download-app` | App download CTA |
| Distributor | `/distributor` | Distributor enquiry |
| Corporate | `/corporate` | Corporate gifting |
| FAQs | `/faqs` | FAQ |
| Terms | `/terms` | Terms of service |
| Privacy | `/privacy` | Privacy policy |
| Return Policy | `/return-policy` | Return policy |
| Shipping Policy | `/shipping-policy` | Shipping policy |
| Payment Policy | `/payment-policy` | Payment policy |
| Disclaimer | `/disclaimer` | Disclaimer |
| Grievance | `/grievance` | Grievance officer |
| Media | `/media` | Press/media |
| 404 | Not Found | Custom 404 |
| Error | Error Boundary | Custom error page |

### Admin Dashboard Pages

| Page | Route | Description |
|------|-------|-------------|
| Overview | `/dashboard` | Stats + recent orders + quick actions |
| Products | `/dashboard/products` | Full CRUD with search/filter |
| Orders | `/dashboard/orders` | Order list + status updates + detail modal |
| Content | `/dashboard/content` | CMS: Header, Hero, Philosophy |
| Pages | `/dashboard/pages/[slug]` | Per-page content management (scaffolded) |

---

## 2. COMPONENT INVENTORY

### Global Components

| Component | Purpose | Dependencies |
|-----------|---------|--------------|
| `Navbar.tsx` | Top navigation, auth state, cart badge | Clerk, cartStore, apiClient |
| `Header.tsx` | Hero section with looping background media | BackgroundMediaItem |
| `Footer.tsx` | Multi-column footer with newsletter + social | SiteSettings, FooterSettings |
| `PhilosophySection.tsx` | Philosophy content block | PhilosophyData type |

### Feature: Products

| Component | Purpose |
|-----------|---------|
| `ProductPageClient.tsx` | Full product detail (media gallery, specs accordion, add-to-cart, notify-me) |
| `CollectionPageClient.tsx` | All categories grid with feature slot + product cards |
| `CategoryPageClient.tsx` | Single category with all its products |
| `FeaturedCollection.tsx` | Server wrapper → client animated grid |
| `FeaturedCollectionClient.tsx` | Animated featured product cards |

### Feature: Dashboard

| Component | Purpose |
|-----------|---------|
| `AdminSidebar.tsx` | Left sidebar nav for admin |
| `DashboardModal.tsx` | Reusable slide-in modal dialog |
| `DashboardSkeleton.tsx` | Table loading skeleton |
| `DashboardToast.tsx` | Toast notifications + useToast hook |
| `StatCard.tsx` | Animated metric card |

### Feature: Checkout / Orders

| Component | Purpose |
|-----------|---------|
| `RazorpayButton.tsx` | Razorpay payment initiation |
| `AddressForm.tsx` | Shipping address form |
| `InvoiceGenerator.tsx` | Lazy-loaded PDF invoice wrapper |
| `InvoiceGeneratorImpl.tsx` | Full PDF invoice rendering |

### Hooks

| Hook | Purpose |
|------|---------|
| `cartStore.ts` | Zustand persisted cart (add/remove/clear/count/total) |
| `addressStore.ts` | Zustand address state |

---

## 3. DATA FLOW AUDIT

### Homepage `/`
- Calls: `GET /api/v1/content/header`, `/content/homepage`, `/content/philosophy`, `/products/featured`
- Tables: `cms_header`, `cms_homepage`, `cms_philosophy`, `products`
- Strategy: Server Component, revalidate: 60s

### Root Layout
- Calls: `GET /api/v1/settings`, `GET /api/v1/footer`
- Tables: `site_settings`, `footer_settings`
- **⚠ GAP: These endpoints do not exist in current backend**

### Collection `/collection`
- Calls: `GET /api/v1/categories`
- Tables: `categories` + `products`

### Category `/collection/[category]`
- Calls: `GET /api/v1/categories/{slug}`
- Tables: `categories`, `products`

### Product `/product/[slug]`
- Calls: `GET /api/v1/products/{slug}`
- Tables: `products`, `categories`

### Cart
- Client-side only via Zustand + localStorage
- No API calls

### Checkout
1. Address: `GET/POST /api/address` → `GET/POST /api/v1/addresses`
2. Payment: `POST /api/razorpay/order` → Razorpay SDK
3. Verify: `POST /api/razorpay/verify` + `POST /api/v1/orders`
4. Success: display orderId

### Account Orders
- `GET /api/v1/orders` (user's own)
- `GET /api/v1/orders/{id}` (single order)

### Notify Me
- `POST /api/notify-me` → `POST /api/v1/notify`
- Table: `notify_requests`

### Dashboard
- Stats: `GET /api/v1/dashboard/stats` (**⚠ mismatch: backend is `/admin/dashboard`**)
- Products: `GET/POST/PUT/DELETE /api/v1/products`
- Orders: `GET /api/v1/orders/admin/all`, `PUT /api/v1/orders/{id}/status`
- CMS: `GET/PUT /api/v1/content/header`, `/homepage`, `/philosophy`
- Upload: `POST /api/v1/upload/multiple`
- Users: `GET /api/v1/users/admin/all`, `PUT /api/v1/users/admin/{id}/role`

---

## 4. ADMIN CAPABILITY AUDIT

| Domain | Required Operations |
|--------|--------------------|
| Products | Full CRUD + images + watch specs + SEO |
| Categories | Full CRUD + feature image/video + display order |
| Orders | List all + update status + view full detail |
| Users | List all + assign admin role |
| Media | Upload images/videos (single + batch) |
| CMS: Header | Logo, nav links, background media items |
| CMS: Homepage | Hero title, subtitle, CTA |
| CMS: Philosophy | Title, description, image |
| CMS: Footer | Newsletter, links, social, copyright |
| Site Settings | SEO title/description/keywords, contact email |
| Dashboard | Stats overview, revenue, pending orders |
| Notify Requests | View list of back-in-stock requests |

---

## 5. IDENTIFIED GAPS (Must Fix)

### Critical Backend Missing Endpoints
1. `GET /api/v1/settings` — called in `layout.tsx`, does not exist
2. `GET /api/v1/footer` — called in `layout.tsx`, does not exist
3. `GET /api/v1/dashboard/stats` — frontend path vs backend `/admin/dashboard` prefix mismatch
4. No `SiteSettings` DB model/table exists despite schema file
5. No `FooterSettings` DB model/table exists

### Data Contract Mismatches
6. Frontend `_id` (Sanity legacy) vs backend `id` — TypeScript types have `_id?` workaround
7. `ProductPageClient` uses camelCase (`mainImage`, `inStock`) but backend returns `snake_case`
8. Category service returns camelCase dict (correct) but `CollectionPageClient` also expects `_id`

### Functional Gaps
9. Product delete in dashboard shows "coming soon" — backend DELETE exists, frontend not wired
10. No backend Razorpay webhook/verify endpoint — verification only in Next.js route handler
11. JWT `verify_aud` set to `FRONTEND_URL` — may need to be disabled for Clerk tokens

---

## 6. BACKEND ARCHITECTURE SUMMARY

```
backend/app/
  api/         routes (thin controllers)
  core/        config, security, deps, logger
  db/          session, seed
  models/      SQLAlchemy ORM
  repositories/ data access layer
  schemas/     Pydantic v2
  services/    business logic
  utils/       slugify, etc.
```

### Auth Flow
1. Clerk issues RS256 JWT to frontend
2. Frontend passes token in `Authorization: Bearer` header
3. Next.js route handlers forward to FastAPI
4. FastAPI fetches Clerk JWKS, verifies signature
5. User synced to local `users` table on first request
6. Admin role: `users.role = "admin"` in local DB + `publicMetadata.role` in Clerk
