# DATABASE_DESIGN.md — BODHIQ Platform

> **Database:** SQLite (dev) → PostgreSQL (prod)
> **ORM:** SQLAlchemy 2.0 with Mapped columns
> **Migrations:** Alembic

---

## Table Inventory

| Table | Description |
|-------|-------------|
| `users` | Clerk-synced users with local roles |
| `categories` | Product collections with media |
| `products` | Watches with specs, pricing, media, SEO |
| `order_items` | Line items within orders |
| `orders` | Purchase records linked to users |
| `addresses` | User shipping addresses |
| `notify_requests` | Back-in-stock email signups |
| `cms_header` | Singleton: site header + nav + background media |
| `cms_homepage` | Singleton: hero title/subtitle/CTA |
| `cms_philosophy` | Singleton: philosophy section content |
| `site_settings` | Singleton: SEO, logo, contact |
| `footer_settings` | Singleton: footer content, links, social |

---

## Table Definitions

### `users`
```sql
CREATE TABLE users (
    id          VARCHAR(36) PRIMARY KEY,          -- UUID
    clerk_id    VARCHAR(255) UNIQUE NOT NULL,      -- Clerk user ID (user_...)
    email       VARCHAR(255) UNIQUE NOT NULL,
    first_name  VARCHAR(100),
    last_name   VARCHAR(100),
    image_url   VARCHAR(500),
    role        VARCHAR(20) NOT NULL DEFAULT 'user', -- 'user' | 'admin'
    created_at  DATETIME NOT NULL,
    updated_at  DATETIME NOT NULL
);
CREATE INDEX ix_users_clerk_id ON users(clerk_id);
CREATE INDEX ix_users_email ON users(email);
```

### `categories`
```sql
CREATE TABLE categories (
    id                  VARCHAR(36) PRIMARY KEY,  -- UUID
    title               VARCHAR(200) NOT NULL,
    slug                VARCHAR(200) UNIQUE NOT NULL,
    description         TEXT,
    feature_title       VARCHAR(200),
    reverse             BOOLEAN NOT NULL DEFAULT 0,
    "order"             INTEGER NOT NULL DEFAULT 1, -- display order
    feature_image_url   VARCHAR(500),
    feature_video_url   VARCHAR(500),
    seo_meta_title      VARCHAR(200),
    seo_meta_description TEXT,
    seo_keywords        JSON,                     -- list of strings
    created_at          DATETIME NOT NULL,
    updated_at          DATETIME NOT NULL
);
CREATE UNIQUE INDEX ix_categories_slug ON categories(slug);
CREATE INDEX ix_categories_order ON categories("order");
```

### `products`
```sql
CREATE TABLE products (
    id                  VARCHAR(36) PRIMARY KEY,  -- UUID
    name                VARCHAR(200) NOT NULL,
    slug                VARCHAR(200) UNIQUE NOT NULL,
    description         TEXT,
    price               NUMERIC(10, 2) NOT NULL,
    original_price      NUMERIC(10, 2),
    stock               INTEGER NOT NULL DEFAULT 10,
    in_stock            BOOLEAN NOT NULL DEFAULT 1,
    allow_notify        BOOLEAN NOT NULL DEFAULT 1,
    main_image_url      VARCHAR(500),
    images              JSON,                     -- list of URL strings
    product_video_url   VARCHAR(500),
    category_id         VARCHAR(36) NOT NULL REFERENCES categories(id),
    -- Watch-specific specs
    case_size           VARCHAR(50),
    dial_color          VARCHAR(50),
    strap_material      VARCHAR(100),
    case_material       VARCHAR(100),
    movement            VARCHAR(100),
    water_resistance    VARCHAR(50),
    glass_type          VARCHAR(100),
    -- SEO
    seo_meta_title      VARCHAR(200),
    seo_meta_description TEXT,
    seo_keywords        JSON,                     -- list of strings
    created_at          DATETIME NOT NULL,
    updated_at          DATETIME NOT NULL
);
CREATE UNIQUE INDEX ix_products_slug ON products(slug);
CREATE INDEX ix_products_category_id ON products(category_id);
CREATE INDEX ix_products_created_at ON products(created_at);
CREATE INDEX ix_products_in_stock ON products(in_stock);
```

### `orders`
```sql
CREATE TABLE orders (
    id                  VARCHAR(36) PRIMARY KEY,  -- UUID
    order_number        VARCHAR(50) UNIQUE NOT NULL, -- ORD-{timestamp}
    razorpay_order_id   VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    user_id             VARCHAR(36) NOT NULL REFERENCES users(id),
    customer_name       VARCHAR(200) NOT NULL,
    customer_email      VARCHAR(255) NOT NULL,
    amount              NUMERIC(10, 2) NOT NULL,  -- INR
    currency            VARCHAR(10) NOT NULL DEFAULT 'INR',
    status              VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- Status values: pending | paid | shipped | delivered | cancelled
    cart_items          JSON,          -- snapshot [{name, quantity, price, product_id}]
    shipping_address    JSON,          -- snapshot {fullName, street, city, state, postalCode, country, phone}
    created_at          DATETIME NOT NULL,
    updated_at          DATETIME NOT NULL
);
CREATE INDEX ix_orders_user_id ON orders(user_id);
CREATE UNIQUE INDEX ix_orders_order_number ON orders(order_number);
CREATE INDEX ix_orders_status ON orders(status);
CREATE INDEX ix_orders_created_at ON orders(created_at);
```

### `order_items`
```sql
CREATE TABLE order_items (
    id          VARCHAR(36) PRIMARY KEY,      -- UUID
    order_id    VARCHAR(36) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id  VARCHAR(36) REFERENCES products(id) ON DELETE SET NULL,
    name        VARCHAR(200) NOT NULL,        -- denormalized product name
    quantity    INTEGER NOT NULL DEFAULT 1,
    price       NUMERIC(10, 2) NOT NULL       -- price at time of order
);
CREATE INDEX ix_order_items_order_id ON order_items(order_id);
```

### `addresses`
```sql
CREATE TABLE addresses (
    id          VARCHAR(36) PRIMARY KEY,      -- UUID
    user_id     VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name   VARCHAR(200) NOT NULL,
    phone       VARCHAR(20) NOT NULL,
    street      VARCHAR(300) NOT NULL,
    city        VARCHAR(100) NOT NULL,
    state       VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country     VARCHAR(100) NOT NULL DEFAULT 'India',
    is_default  BOOLEAN NOT NULL DEFAULT 0,
    created_at  DATETIME NOT NULL,
    updated_at  DATETIME NOT NULL
);
CREATE INDEX ix_addresses_user_id ON addresses(user_id);
CREATE INDEX ix_addresses_is_default ON addresses(user_id, is_default);
```

### `notify_requests`
```sql
CREATE TABLE notify_requests (
    id              VARCHAR(36) PRIMARY KEY,  -- UUID
    product_id      VARCHAR(36) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_name    VARCHAR(200) NOT NULL,    -- denormalized
    product_slug    VARCHAR(200) NOT NULL,    -- denormalized
    email           VARCHAR(255) NOT NULL,
    clerk_user_id   VARCHAR(255),             -- optional
    notified        BOOLEAN NOT NULL DEFAULT 0,
    created_at      DATETIME NOT NULL
);
CREATE INDEX ix_notify_product_id ON notify_requests(product_id);
CREATE INDEX ix_notify_email ON notify_requests(email);
CREATE UNIQUE INDEX ix_notify_unique ON notify_requests(product_id, email);
-- Prevents duplicate requests from the same email for the same product
```

### `cms_header` (Singleton, id=1)
```sql
CREATE TABLE cms_header (
    id                INTEGER PRIMARY KEY DEFAULT 1,
    logo_text         VARCHAR(100) NOT NULL DEFAULT 'BODHIQ',
    nav_links         JSON NOT NULL DEFAULT '[]',
    -- [{title: string, href: string}]
    background_media  JSON NOT NULL DEFAULT '[]'
    -- [{type: "image"|"video", url: string, order: int}]
);
```

### `cms_homepage` (Singleton, id=1)
```sql
CREATE TABLE cms_homepage (
    id              INTEGER PRIMARY KEY DEFAULT 1,
    hero_title      VARCHAR(200) NOT NULL DEFAULT 'BODHIQ',
    hero_subtitle   VARCHAR(300) NOT NULL DEFAULT 'Luxury Timepieces',
    hero_cta        VARCHAR(100) NOT NULL DEFAULT 'Discover'
);
```

### `cms_philosophy` (Singleton, id=1)
```sql
CREATE TABLE cms_philosophy (
    id          INTEGER PRIMARY KEY DEFAULT 1,
    title       VARCHAR(200) NOT NULL DEFAULT 'The Philosophy',
    description TEXT NOT NULL,
    image_url   VARCHAR(500)
);
```

### `site_settings` (Singleton, id=1) [NEW]
```sql
CREATE TABLE site_settings (
    id              INTEGER PRIMARY KEY DEFAULT 1,
    logo_text       VARCHAR(100) DEFAULT 'BODHIQ',
    contact_email   VARCHAR(255) DEFAULT 'hello@bodhiq.in',
    seo_title       VARCHAR(200),
    seo_description TEXT,
    seo_keywords    JSON          -- list of strings
);
```

### `footer_settings` (Singleton, id=1) [NEW]
```sql
CREATE TABLE footer_settings (
    id                      INTEGER PRIMARY KEY DEFAULT 1,
    newsletter_text         VARCHAR(300),
    newsletter_placeholder  VARCHAR(100),
    newsletter_button_text  VARCHAR(50),
    company_links           JSON,  -- [{label: string, href: string}]
    quick_links             JSON,  -- [{label: string, href: string}]
    contact_email_primary   VARCHAR(255),
    contact_email_secondary VARCHAR(255),
    social_links            JSON,  -- [{platform: string, href: string, icon: string}]
    copyright_text          VARCHAR(200),
    bottom_tagline          VARCHAR(200)
);
```

---

## Relationships (ER Overview)

```
users ──────────── orders (1:many)
users ──────────── addresses (1:many)
categories ─────── products (1:many)
orders ─────────── order_items (1:many)
products ───────── order_items (1:many, nullable)
products ───────── notify_requests (1:many)
```

---

## Constraints Summary

| Table | Constraint |
|-------|-----------|
| `users.clerk_id` | UNIQUE — one local record per Clerk user |
| `users.email` | UNIQUE — email is identity |
| `categories.slug` | UNIQUE — URL routing |
| `products.slug` | UNIQUE — URL routing |
| `orders.order_number` | UNIQUE — human-readable order ID |
| `notify_requests` | UNIQUE (product_id, email) — no duplicate subscriptions |
| `order_items.order_id` | ON DELETE CASCADE — items deleted with order |
| `order_items.product_id` | ON DELETE SET NULL — keeps item record if product deleted |
| `addresses.user_id` | ON DELETE CASCADE — addresses deleted with user |
| `notify_requests.product_id` | ON DELETE CASCADE — requests deleted with product |
| `cms_header.id` | DEFAULT 1 — enforces singleton pattern |
| `cms_homepage.id` | DEFAULT 1 — enforces singleton pattern |
| `cms_philosophy.id` | DEFAULT 1 — enforces singleton pattern |
| `site_settings.id` | DEFAULT 1 — enforces singleton pattern |
| `footer_settings.id` | DEFAULT 1 — enforces singleton pattern |

---

## Index Strategy

### Performance Indexes
- `products(category_id)` — filter by category
- `products(in_stock)` — filter by availability
- `products(created_at DESC)` — featured/recent queries
- `orders(user_id)` — user's orders
- `orders(status)` — filter by order status
- `orders(created_at DESC)` — recent orders dashboard
- `addresses(user_id, is_default)` — default address lookup
- `notify_requests(product_id)` — notify by product

### Unique Indexes
- `users(clerk_id)`, `users(email)`
- `categories(slug)`, `products(slug)`
- `orders(order_number)`
- `notify_requests(product_id, email)`

---

## PostgreSQL Migration Notes

When switching `DATABASE_URL` to PostgreSQL:
- `JSON` columns → `JSONB` (faster indexing)
- `BOOLEAN` → native PostgreSQL BOOLEAN
- `DATETIME` → `TIMESTAMP WITH TIME ZONE`
- `VARCHAR(36)` UUIDs → native `UUID` type
- `NUMERIC(10,2)` → `NUMERIC(10,2)` (same)
- All indexes remain valid
- Alembic migration needed for type changes
