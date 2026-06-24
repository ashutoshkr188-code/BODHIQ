# CMS_ARCHITECTURE.md — BODHIQ Platform

> The CMS replaces Sanity.io with a custom SQLite/PostgreSQL-backed system served via FastAPI.
> All CMS content is editable through the admin dashboard without code changes.

---

## CMS Design Principles

1. **Singleton Tables** — Global content (header, homepage, footer, settings) uses id=1 singleton rows
2. **JSON Columns** — Ordered lists (nav links, media items, footer links) stored as JSON arrays
3. **Media Agnostic** — Supports both image URLs and video URLs in all media fields
4. **Background Media Array** — Header supports multiple images/videos with ordering for loop effect
5. **Admin-Only Writes** — All PUT endpoints require `get_admin_user` dependency
6. **Public Reads** — All GET endpoints are unauthenticated for SSR performance

---

## Global Content Types

### 1. Site Header (`/api/v1/content/header`)

Controls the hero section background and navigation.

**DB Table:** `cms_header` (singleton id=1)

**Schema:**
```json
{
  "logo_text": "BODHIQ",
  "nav_links": [
    {"title": "The Collection", "href": "/collection"},
    {"title": "Philosophy", "href": "/values"}
  ],
  "background_media": [
    {"type": "image", "url": "/watches/shunya-1/hero.jpg", "order": 0},
    {"type": "video", "url": "/uploads/hero-loop.mp4", "order": 1}
  ]
}
```

**Frontend Usage:** `layout.tsx` → `Navbar.tsx`, `Header.tsx`

**Admin UI:** Media upload panel, drag-to-reorder list, nav link editor

---

### 2. Homepage Hero (`/api/v1/content/homepage`)

Controls the hero text overlay on the landing page.

**DB Table:** `cms_homepage` (singleton id=1)

**Schema:**
```json
{
  "hero_title": "BODHIQ SHUNYA I",
  "hero_subtitle": "Imperfect. Almost.",
  "hero_cta": "Discover the Watch"
}
```

**Frontend Usage:** `page.tsx` server component → `Header.tsx`

**Admin UI:** Three text fields in the Content dashboard tab

---

### 3. Philosophy Section (`/api/v1/content/philosophy`)

Controls the brand philosophy content block below the hero.

**DB Table:** `cms_philosophy` (singleton id=1)

**Schema:**
```json
{
  "title": "The Philosophy",
  "description": "In a world obsessed with perfection...",
  "image_url": "/watches/shunya-1/hero.jpg"
}
```

**Frontend Usage:** `page.tsx` → `PhilosophySection.tsx`

**Admin UI:** Title + textarea + image upload in Content dashboard

---

### 4. Site Settings (`/api/v1/settings`)

Global SEO and contact settings used in layout.

**DB Table:** `site_settings` (singleton id=1)

**Schema (Frontend SiteSettings type):**
```json
{
  "logoText": "BODHIQ",
  "navLinks": [...],
  "contactEmail": "hello@bodhiq.in",
  "footerText": null,
  "seoTitle": "BODHIQ SHUNYA I — Imperfect. Almost.",
  "seoDescription": "...",
  "seoKeywords": ["BODHIQ", "luxury watch", ...]
}
```

**Frontend Usage:** `layout.tsx` `generateMetadata()` + `Navbar.tsx`

**Admin UI:** Settings page with SEO fields

---

### 5. Footer Settings (`/api/v1/footer`)

All footer content including newsletter, links, social.

**DB Table:** `footer_settings` (singleton id=1)

**Schema (Frontend FooterSettings type):**
```json
{
  "newsletterText": "Stay in the loop.",
  "newsletterPlaceholder": "Your email address",
  "newsletterButtonText": "Subscribe",
  "companyLinks": [
    {"label": "About", "href": "/about"},
    {"label": "Craftsmanship", "href": "/craftsmanship"}
  ],
  "quickLinks": [
    {"label": "Track Order", "href": "/track-order"},
    {"label": "Returns", "href": "/return-policy"}
  ],
  "contactEmailPrimary": "hello@bodhiq.in",
  "contactEmailSecondary": "support@bodhiq.in",
  "socialLinks": [
    {"platform": "Instagram", "href": "https://instagram.com/bodhiq.in", "icon": "instagram"}
  ],
  "copyrightText": "© 2026 BODHIQ. All rights reserved.",
  "bottomTagline": "Imperfect. Almost."
}
```

**Frontend Usage:** `layout.tsx` → `Footer.tsx`

**Admin UI:** Footer settings tab with link editors

---

## Dynamic Page System

### Category Pages
- Categories are CMS-managed with:
  - `title`, `slug`, `description`
  - `featureTitle` — displayed over feature image/video
  - `featureImage` / `featureVideo` — hero media for category
  - `reverse` — flip image/products layout
  - `order` — display order in collection page
- Admin can upload category feature images/videos through media uploader

### Product Pages
- Products are fully CMS-managed with:
  - Core fields: name, slug, description, price, stock
  - Media: `main_image_url`, `images[]`, `product_video_url`
  - Watch specs: case_size, dial_color, strap_material, etc.
  - SEO: meta title, description, keywords

---

## Media Management

### Upload Architecture

```
POST /api/v1/upload          → single file, returns {url, filename, type}
POST /api/v1/upload/multiple → multiple files, returns {success, files: [...]}
GET  /uploads/{filename}     → static file serving (FastAPI StaticFiles)
```

**Allowed Formats:**
- Images: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
- Videos: `.mp4`, `.webm`, `.mov`

**Max Size:** 50MB per file

**Storage:** Local `uploads/` directory (can swap to S3 for production)

**URL Format:** `/uploads/{uuid}{ext}` — served statically

### Background Media (Header Hero)

The header supports a looping sequence of images/videos:

```json
"background_media": [
  {"type": "image", "url": "/watches/shunya-1/hero.jpg", "order": 0},
  {"type": "video", "url": "/uploads/abc123.mp4", "order": 1},
  {"type": "image", "url": "/uploads/def456.jpg", "order": 2}
]
```

- Items are sorted by `order` field
- Frontend `Header.tsx` loops through them automatically
- Admin can add, remove, and reorder via the CMS UI

---

## Admin Dashboard CMS UI Design

### Content Tab (`/dashboard/content`)

Sections:
1. **Background Media** — drag-and-drop media uploader + ordered list
2. **Homepage Hero** — 3 text fields (title, subtitle, CTA)
3. **Philosophy** — title + large textarea + image picker
4. **Navigation Links** — editable list of {title, href} pairs

### Settings Tab (`/dashboard/settings`) [to be built]

Sections:
1. **SEO** — title, description, keywords
2. **Contact** — email address
3. **Logo** — logo text

### Footer Tab (`/dashboard/footer`) [to be built]

Sections:
1. **Newsletter** — text, placeholder, button label
2. **Company Links** — editable list
3. **Quick Links** — editable list
4. **Social Links** — platform + URL list
5. **Copyright** — text + tagline

---

## CMS Service Layer Design

```python
class CMSService:
    def get_header(db) -> HeaderContent:
        return cms_repo.get_or_create_header(db)

    def update_header(db, payload) -> HeaderContent:
        return cms_repo.update_header(db, payload)

    def get_philosophy(db) -> PhilosophyContent:
        return cms_repo.get_or_create_philosophy(db)

    def update_philosophy(db, payload) -> PhilosophyContent:
        return cms_repo.update_philosophy(db, payload)

    def get_homepage(db) -> HomepageContent:
        return cms_repo.get_or_create_homepage(db)

    def update_homepage(db, payload) -> HomepageContent:
        return cms_repo.update_homepage(db, payload)

class SettingsService:
    def get_settings(db) -> SiteSettings:
        # Returns defaults if no settings row exists
        return settings_repo.get_or_create_settings(db)

    def update_settings(db, payload) -> SiteSettings:
        return settings_repo.update_settings(db, payload)

    def get_footer(db) -> FooterSettings:
        return settings_repo.get_or_create_footer(db)

    def update_footer(db, payload) -> FooterSettings:
        return settings_repo.update_footer(db, payload)
```

---

## CMS Repository Pattern

```python
class CMSRepository:
    def get_or_create_header(db) -> HeaderContent:
        row = db.query(HeaderContent).filter_by(id=1).first()
        if not row:
            row = HeaderContent(id=1)
            db.add(row)
            db.commit()
            db.refresh(row)
        return row

    def update_header(db, payload) -> HeaderContent:
        row = self.get_or_create_header(db)
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(row, field, value)
        db.commit()
        db.refresh(row)
        return row
```

Same pattern for homepage, philosophy, site_settings, footer_settings.
