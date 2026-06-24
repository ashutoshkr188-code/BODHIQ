# ARCHITECTURE_PLAN.md — BODHIQ Backend

> **Stack:** FastAPI + SQLAlchemy 2.0 + SQLite (→ PostgreSQL) + Alembic + Pydantic v2 + Clerk

---

## Design Principles

1. **Clean Architecture** — Routes call services, services call repositories, repositories call ORM
2. **Repository Pattern** — All DB queries in repositories; no raw SQL in routes or services
3. **Service Layer** — All business logic in services; routes are thin validation-only controllers
4. **Dependency Injection** — DB sessions and auth via FastAPI `Depends()`
5. **No business logic in routes** — Routes only validate input, call service, return response
6. **PostgreSQL-ready** — SQLite for dev, PostgreSQL for prod via `DATABASE_URL` env var

---

## Directory Structure

```
backend/
├── .env
├── requirements.txt
├── run_backend.bat
├── alembic.ini
├── alembic/
│   ├── env.py
│   └── versions/
│       └── 001_initial_schema.py
└── app/
    ├── __init__.py
    ├── main.py                          # App factory, middleware, router registration
    ├── api/
    │   ├── __init__.py
    │   ├── products.py                  # GET/POST/PUT/DELETE /products
    │   ├── categories.py                # GET/POST/PUT/DELETE /categories
    │   ├── orders.py                    # GET/POST /orders + admin routes
    │   ├── addresses.py                 # GET/POST/PUT/DELETE /addresses
    │   ├── users.py                     # GET /users/me + admin user management
    │   ├── dashboard.py                 # GET /dashboard/stats
    │   ├── cms.py                       # GET/PUT /content/* (header, homepage, philosophy)
    │   ├── settings.py                  # GET/PUT /settings + GET /footer [NEW]
    │   ├── notify.py                    # POST /notify
    │   ├── uploads.py                   # POST /upload + /upload/multiple
    │   └── cart.py                      # (reserved)
    ├── core/
    │   ├── __init__.py
    │   ├── config.py                    # Pydantic Settings (env vars)
    │   ├── deps.py                      # get_db, get_current_user, get_admin_user
    │   ├── security.py                  # Clerk JWT verification + JWKS cache
    │   └── logger.py                    # Structured logging setup
    ├── db/
    │   ├── __init__.py
    │   ├── session.py                   # SQLAlchemy engine + SessionLocal + Base
    │   └── seed.py                      # Initial data seeder
    ├── models/
    │   ├── __init__.py                  # Import all models for Alembic detection
    │   ├── user.py                      # User (clerk_id, email, role)
    │   ├── product.py                   # Product (specs, pricing, media, SEO)
    │   ├── category.py                  # Category (collections with media)
    │   ├── order.py                     # Order + OrderItem
    │   ├── address.py                   # User shipping addresses
    │   ├── cms.py                       # CMS singletons (header, homepage, philosophy)
    │   ├── settings.py                  # SiteSettings + FooterSettings [NEW]
    │   └── notify.py                    # NotifyRequest (back-in-stock)
    ├── schemas/
    │   ├── __init__.py
    │   ├── product.py                   # ProductCreate, ProductUpdate, ProductResponse
    │   ├── category.py                  # CategoryCreate, CategoryUpdate, CategoryResponse
    │   ├── order.py                     # OrderCreate, OrderStatusUpdate, OrderResponse
    │   ├── address.py                   # AddressCreate, AddressUpdate, AddressResponse
    │   ├── user.py                      # UserResponse, UserRoleUpdate
    │   ├── cms.py                       # Header/Homepage/Philosophy schemas
    │   ├── settings.py                  # SiteSettingsResponse/Update, FooterResponse [NEW]
    │   ├── dashboard.py                 # DashboardStats
    │   └── notify.py                    # NotifyRequest schema
    ├── repositories/
    │   ├── __init__.py
    │   ├── product_repo.py              # Product CRUD + featured + paginated list
    │   ├── category_repo.py             # Category CRUD + products query
    │   ├── order_repo.py                # Order CRUD + paginated + user orders
    │   ├── address_repo.py              # Address CRUD per user
    │   ├── user_repo.py                 # User find/create/update
    │   ├── cms_repo.py                  # CMS singletons get/upsert
    │   ├── settings_repo.py             # SiteSettings + Footer get/upsert [NEW]
    │   ├── dashboard_repo.py            # Aggregate stats queries
    │   └── notify_repo.py              # NotifyRequest save/list
    ├── services/
    │   ├── __init__.py
    │   ├── product_service.py           # Product business logic
    │   ├── category_service.py          # Category business logic
    │   ├── order_service.py             # Order creation (price verification), status
    │   ├── address_service.py           # Address management
    │   ├── user_service.py              # User sync + role management
    │   ├── cms_service.py               # CMS content management
    │   ├── settings_service.py          # Site settings management [NEW]
    │   ├── dashboard_service.py         # Dashboard stats aggregation
    │   └── notify_service.py           # Notify me management
    └── utils/
        ├── __init__.py
        └── slugify.py                   # URL slug generation
```

---

## API Route Map (Complete)

```
GET    /                              → health
GET    /health                        → health check

# Products
GET    /api/v1/products               → list (paginated, filterable by category)
GET    /api/v1/products/featured      → top 4 products
GET    /api/v1/products/{slug}        → single product by slug
POST   /api/v1/products               → create [admin]
PUT    /api/v1/products/{id}          → update [admin]
DELETE /api/v1/products/{id}          → delete [admin]

# Categories
GET    /api/v1/categories             → list all with products
GET    /api/v1/categories/{slug}      → single category + all products
POST   /api/v1/categories             → create [admin]
PUT    /api/v1/categories/{id}        → update [admin]
DELETE /api/v1/categories/{id}        → delete [admin]

# Orders
GET    /api/v1/orders                 → user's own orders [auth]
GET    /api/v1/orders/{id}            → single order [auth, own or admin]
POST   /api/v1/orders                 → create order after payment [auth]
PUT    /api/v1/orders/{id}/status     → update status [admin]
GET    /api/v1/orders/admin/all       → all orders paginated [admin]

# Addresses
GET    /api/v1/addresses              → user's addresses [auth]
POST   /api/v1/addresses              → create address [auth]
PUT    /api/v1/addresses/{id}         → update address [auth]
DELETE /api/v1/addresses/{id}         → delete address [auth]

# Users
GET    /api/v1/users/me               → current user profile [auth]
GET    /api/v1/users/admin/all        → all users paginated [admin]
PUT    /api/v1/users/admin/{id}/role  → update role [admin]

# Dashboard
GET    /api/v1/dashboard/stats        → aggregate stats [admin]

# CMS Content
GET    /api/v1/content/header         → header config (public)
PUT    /api/v1/content/header         → update header [admin]
GET    /api/v1/content/homepage       → homepage hero (public)
PUT    /api/v1/content/homepage       → update hero [admin]
GET    /api/v1/content/philosophy     → philosophy content (public)
PUT    /api/v1/content/philosophy     → update philosophy [admin]

# Site Settings (NEW)
GET    /api/v1/settings               → site settings (public, for layout)
PUT    /api/v1/settings               → update settings [admin]
GET    /api/v1/footer                 → footer data (public, for layout)
PUT    /api/v1/footer                 → update footer [admin]

# Notify
POST   /api/v1/notify                 → back-in-stock notification (public)
GET    /api/v1/notify/admin/all       → list all notify requests [admin]

# Uploads
POST   /api/v1/upload                 → upload single file [admin]
POST   /api/v1/upload/multiple        → upload multiple files [admin]
```

---

## Authentication Design

```python
# Three levels of auth dependency:

def get_db() -> Session:
    """Yields DB session, ensures cleanup."""

async def get_current_user(credentials, db) -> User:
    """Verifies Clerk JWT, syncs user to DB, returns User."""
    # Raises HTTP 401 if no token or invalid token

async def get_current_user_optional(credentials, db) -> User | None:
    """Like get_current_user but returns None instead of 401."""

async def get_admin_user(user = Depends(get_current_user)) -> User:
    """Raises HTTP 403 if user.role != 'admin'."""
```

### Clerk JWT Verification
```python
# 1. Fetch JWKS from Clerk (cached 1 hour)
# 2. Find matching key by kid header
# 3. Decode JWT with RS256
# 4. Extract: sub (clerk_id), email, first_name, last_name
# 5. Sync to local users table
# Note: audience verification disabled (Clerk tokens don't include audience)
```

---

## Configuration (Pydantic Settings)

```python
class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./bodhiq.db"
    CLERK_JWKS_URL: str = ""
    CORS_ORIGINS: str = "http://localhost:3000"
    FRONTEND_URL: str = "http://localhost:3000"
    RAZORPAY_KEY_ID: str = ""
    RAZORPAY_KEY_SECRET: str = ""
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 50
```

---

## Response Shape Contracts

### Standard Paginated Response
```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "per_page": 20,
  "total_pages": 5
}
```

### Product Response (matches frontend types)
```json
{
  "id": "uuid",
  "name": "BODHIQ Shunya I",
  "slug": "bodhiq-shunya-i",
  "price": 14999.00,
  "original_price": 19999.00,
  "stock": 50,
  "in_stock": true,
  "allow_notify": true,
  "main_image_url": "/watches/...",
  "images": ["/watches/..."],
  "product_video_url": null,
  "category_id": "uuid",
  "category": "Watches",
  "case_size": "40mm",
  "dial_color": "Black & Gold",
  "strap_material": "Genuine Leather",
  "case_material": "316L Stainless Steel",
  "movement": "Japanese Miyota Quartz",
  "water_resistance": "3 ATM",
  "glass_type": "Hardened Mineral Crystal",
  "seo_meta_title": null,
  "seo_meta_description": null,
  "seo_keywords": null,
  "created_at": "2026-01-01T00:00:00"
}
```

### Category Response (matches CollectionPageClient camelCase mapping)
```json
{
  "id": "uuid",
  "_id": "uuid",
  "title": "Watches",
  "slug": "watches",
  "description": "...",
  "featureTitle": "The Shunya Collection",
  "reverse": false,
  "featureImage": null,
  "featureVideo": null,
  "products": [
    {
      "id": "uuid",
      "_id": "uuid",
      "name": "BODHIQ Shunya I",
      "slug": "bodhiq-shunya-i",
      "price": 14999.00,
      "originalPrice": 19999.00,
      "inStock": true,
      "allowNotify": true,
      "mainImage": "/watches/shunya-1/hero.jpg"
    }
  ]
}
```

---

## Error Handling

```python
# Standard error responses:
# 400 Bad Request       — validation errors, duplicate slugs
# 401 Unauthorized      — missing or invalid Clerk token
# 403 Forbidden         — user is not admin
# 404 Not Found         — resource does not exist
# 422 Unprocessable     — Pydantic validation failure (FastAPI automatic)
# 500 Internal          — unexpected server errors (logged, generic message returned)
```

---

## Rate Limiting

```python
# slowapi limits:
# /api/v1/notify        → 5/minute per IP
# POST /api/v1/orders   → 10/minute per IP
# All others            → default unlimited (can add as needed)
```
