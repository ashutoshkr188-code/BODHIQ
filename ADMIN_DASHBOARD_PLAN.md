# ADMIN_DASHBOARD_PLAN.md — BODHIQ Platform

> Luxury dark admin dashboard with gold (#d4a853) accents.
> Design language: Glassmorphism, subtle animations, serif typography.

---

## Dashboard Access Control

- **Route:** `/dashboard` (and all sub-routes)
- **Guard:** `dashboard/layout.tsx` checks `user.publicMetadata.role === "admin"`
- **Backend:** Every admin API call requires `get_admin_user` dependency (HTTP 403 if not admin)
- **Redirect:** Non-admin users redirected to `/` on access attempt

---

## Sidebar Navigation (AdminSidebar)

```
BODHIQ                    [Logo/Brand]
─────────────────────────

[✦] Overview              /dashboard
[☰] Products              /dashboard/products
[◈] Orders                /dashboard/orders
[◎] Users                 /dashboard/users       [TO BUILD]
[◫] Media Library         /dashboard/media       [TO BUILD]
[◧] Content               /dashboard/content
[◨] Footer                /dashboard/footer      [TO BUILD]
[◩] Settings              /dashboard/settings    [TO BUILD]

─────────────────────────
[User Avatar] [Name]
[Sign Out]
```

---

## Dashboard Sections

### 1. Overview (`/dashboard`)
**Status: ✅ Exists**

**Layout:**
- Header: "Overview" title + current date
- Stats Grid (4 cards):
  - Total Revenue (₹ formatted)
  - Total Orders
  - Products Count
  - Users Count
- 2-column split:
  - Left: Quick Actions (Add Product, Manage Orders, Edit Content)
  - Left: Pending Orders alert badge
  - Right: Recent Orders table (last 5)

**API:** `GET /api/v1/dashboard/stats`

**Response shape:**
```json
{
  "total_revenue": 150000,
  "total_orders": 12,
  "total_products": 4,
  "total_users": 45,
  "pending_orders": 3,
  "recent_orders": [
    {"id": "...", "order_number": "ORD-123", "customer_name": "...", "amount": 14999, "status": "paid", "created_at": "..."}
  ]
}
```

---

### 2. Products (`/dashboard/products`)
**Status: ✅ Exists (delete not wired)**

**Layout:**
- Header: "Products" + item count + "Add Product" button
- Search bar + stock filter
- Products table: Product | Price | Stock | Status | Actions
- Create/Edit Modal (inline, full-featured)
- Delete confirmation modal

**Forms - Create/Edit Product:**
- Image URL (with preview)
- Product Name (auto-generates slug)
- URL Slug (editable)
- Description (textarea)
- Price (₹) | Stock | Category
- Watch Specs: Case Size, Dial Color, Strap, Case Material, Movement, Water Resistance, Glass
- Media: Additional images (URL list) + video URL
- SEO: Meta title, meta description, keywords
- Flags: in_stock toggle, allow_notify toggle

**API:**
- `GET /api/v1/products?page=1&per_page=100`
- `POST /api/v1/products`
- `PUT /api/v1/products/{id}`
- `DELETE /api/v1/products/{id}` ← **wire this**

---

### 3. Orders (`/dashboard/orders`)
**Status: ✅ Exists**

**Layout:**
- Header: "Orders" + total count
- Search (order #, customer name, email) + status filter
- Orders table: Order | Customer | Amount | Status | Date | Actions
- View detail (Eye icon → modal with full order view)
- Status dropdown per row (inline update)

**Order Detail Modal:**
- Status banner (color-coded)
- Customer info + Payment info
- Shipping address
- Order items list
- Total

**API:**
- `GET /api/v1/orders/admin/all?page=1&per_page=50`
- `PUT /api/v1/orders/{id}/status`

**Order statuses:** `pending → paid → shipped → delivered → cancelled`

---

### 4. Users (`/dashboard/users`)
**Status: 🚧 TO BUILD**

**Layout:**
- Header: "Users" + count
- Search bar
- Users table: Name | Email | Role | Joined Date | Actions
- Role update (dropdown: user/admin)

**API:**
- `GET /api/v1/users/admin/all?page=1&per_page=50`
- `PUT /api/v1/users/admin/{id}/role`

---

### 5. Media Library (`/dashboard/media`)
**Status: 🚧 TO BUILD**

**Layout:**
- Upload zone (drag-and-drop, multi-file)
- Grid view of uploaded files (images shown as thumbnails, videos with play icon)
- Copy URL button per file
- File type badge (IMAGE / VIDEO)
- Delete file option

**API:**
- `POST /api/v1/upload/multiple`
- (Listing uploaded files: can scan uploads directory)

---

### 6. Content (`/dashboard/content`)
**Status: ✅ Exists (basic)**

**Layout:**
- Tab 1: Background Media
  - Upload new media files
  - Ordered list of current media items (image/video)
  - Drag to reorder (or up/down arrows)
  - Remove item button
  - Preview thumbnails
- Tab 2: Homepage Hero
  - Hero Title input
  - Hero Subtitle input
  - CTA Button Text input
  - Save button
- Tab 3: Philosophy
  - Title input
  - Description textarea
  - Image URL / upload button
  - Image preview
  - Save button
- Tab 4: Navigation
  - Editable list of nav links (title + href)
  - Add/remove links

**API:**
- `GET/PUT /api/v1/content/header`
- `GET/PUT /api/v1/content/homepage`
- `GET/PUT /api/v1/content/philosophy`

---

### 7. Footer (`/dashboard/footer`)
**Status: 🚧 TO BUILD**

**Layout:**
- Newsletter section (text, placeholder, button label)
- Company Links editor (add/edit/remove)
- Quick Links editor (add/edit/remove)
- Contact Emails (primary + secondary)
- Social Links editor (platform + URL)
- Copyright text
- Bottom tagline

**API:**
- `GET/PUT /api/v1/footer`

---

### 8. Settings (`/dashboard/settings`)
**Status: 🚧 TO BUILD**

**Layout:**
- Logo text
- Contact email
- SEO Title
- SEO Description
- SEO Keywords (tag input)

**API:**
- `GET/PUT /api/v1/settings`

---

## Design Tokens

```css
/* Color Palette */
--bg-base: #050505;
--bg-card: rgba(255,255,255,0.015);
--border-subtle: rgba(255,255,255,0.04);
--border-hover: rgba(212,168,83,0.20);
--gold-primary: #d4a853;
--gold-light: #e8c97a;
--text-primary: #ffffff;
--text-secondary: #9ca3af;
--text-muted: #4b5563;

/* Status Colors */
--status-pending-bg: rgba(245,158,11,0.08);
--status-pending-text: #fbbf24;
--status-paid-bg: rgba(16,185,129,0.08);
--status-paid-text: #34d399;
--status-shipped-bg: rgba(59,130,246,0.08);
--status-shipped-text: #60a5fa;
--status-delivered-bg: rgba(16,185,129,0.08);
--status-delivered-text: #6ee7b7;
--status-cancelled-bg: rgba(239,68,68,0.08);
--status-cancelled-text: #f87171;
```

---

## Interaction Patterns

- **Modal:** Full-screen overlay with framer-motion fade + scale animation
- **Toast:** Bottom-right notification (success=green, error=rose, info=amber) — auto-dismiss 4s
- **Skeleton:** Animated pulse placeholder while data loads
- **Hover states:** Rows reveal action buttons on hover (opacity-0 → opacity-100)
- **Button interactions:** `whileHover={{ scale: 1.02 }}`, `whileTap={{ scale: 0.98 }}`
- **Table rows:** Staggered animation on load (`delay: i * 30ms`)
- **Status changes:** Optimistic update (change local state immediately, revert on error)
