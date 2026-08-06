# BODHIQ Performance and Infrastructure Audit (v2)

> **Last updated:** Aug 6, 2026 — Pre-launch re-audit for AWS free-tier deployment

This document outlines the performance and infrastructure audit findings for the BODHIQ application, covering both the Next.js frontend and the FastAPI backend ecosystem.

---

## Previous Audit (Jul 24) — Fixed Items ✅

| Issue | Fix Applied | Status |
|-------|------------|--------|
| Raw `<img>` tags (11 instances) | Migrated to `next/image` `<Image />` in 7 files | ✅ Done |
| Razorpay manual script injection | Refactored to `next/script` with `lazyOnload` | ✅ Done |
| DB connection pooling | Added `pool_size=20, max_overflow=10` for PostgreSQL | ✅ Done |
| Nginx proxy cache missing | Added 1GB `proxy_cache_path` with 60m validity | ✅ Done |
| Out-of-stock badge not shown | Added "Out of Stock" badge to `FeaturedCollectionClient.tsx` | ✅ Done |

---

## Re-Audit (Aug 6) — Issues Found & Fixed

### 1. `docker-compose.prod.yml` — `awslogs` driver crash (**CRITICAL**)
> [!CAUTION]
> The `awslogs` logging driver requires IAM role + CloudWatch agent setup. Without it, all containers fail to start on bare EC2.

- **Fix applied:** Switched to `json-file` logging driver with `max-size: 10m, max-file: 3` rotation.
- **Also added:** SQLite volume (`sqlite_data:/data`), `ENV: "production"`, reduced resource limits for t3.micro.

### 2. CSP blocks Razorpay in production (**CRITICAL**)
> [!CAUTION]
> Content-Security-Policy in `next.config.ts` didn't explicitly whitelist Razorpay domains for `script-src` and `frame-src`.

- **Fix applied:** Added `https://checkout.razorpay.com` and `https://api.razorpay.com` to CSP `script-src` and `frame-src`.

### 3. `ENV=production` not set (**HIGH**)
> [!WARNING]
> FastAPI checks `os.getenv("ENV")` to disable Swagger docs. Without setting it, `/docs` is publicly exposed.

- **Fix applied:** Added `ENV: "production"` to backend service environment in `docker-compose.prod.yml`.

### 4. Resource limits too high for t3.micro (**HIGH**)
> [!WARNING]
> Original config reserved 768M+ across 3 services — exceeds t3.micro's 1GB RAM.

- **Fix applied:** Reduced to Nginx 64M + Backend 384M + Frontend 384M. Reduced uvicorn workers from 4 → 2.

### 5. `console.log` leaking PII in checkout (**MEDIUM**)
> [!NOTE]
> `CheckoutAddressClient.tsx:41` logged full customer address (name, street, phone) to browser console.

- **Fix applied:** Removed the debug `console.log` statement.

### 6. Homepage `force-dynamic` + `cache: "no-store"` (**HIGH**)
> [!WARNING]
> Every homepage load hit the backend 4 times (header, homepage, philosophy, promo) with zero caching.

- **Fix applied:** Removed `export const dynamic = "force-dynamic"` and all `cache: "no-store"` overrides. Pages now use ISR with 60-second revalidation by default.

### 7. Layout fetches using `cache: "no-store"` (**MEDIUM**)
- **Fix applied:** Removed `cache: "no-store"` from settings and footer fetches in `layout.tsx`. Now uses default 60s ISR.

---

## Current Status — What's Good ✅

| Area | Status |
|------|--------|
| Image optimization (`next/image`) | ✅ All public pages converted |
| Razorpay via `next/script` | ✅ `lazyOnload` strategy |
| DB pooling (PostgreSQL-ready) | ✅ `pool_size=20, max_overflow=10` |
| Nginx proxy cache | ✅ 1GB cache, 60m validity |
| Rate limiting (Nginx + slowapi) | ✅ Dual-layer: 60r/m API, 5r/m notify, 10r/m upload |
| Security headers | ✅ HSTS, X-Frame-Options, CSP, X-Content-Type-Options |
| Non-root Docker users | ✅ `bodhiq` (backend) / `nextjs` (frontend) |
| Standalone Next.js build | ✅ Multi-stage Dockerfile |
| SEO (sitemap, robots, JSON-LD, OG) | ✅ Comprehensive |
| Error boundaries + 404 page | ✅ Custom styled |
| `.gitignore` covers secrets + DB files | ✅ Thorough |
| Production mode disables Swagger docs | ✅ `ENV=production` set |
| ISR caching for public pages | ✅ 60s revalidation |
| Logging rotation | ✅ `json-file` with 10m/3 file limit |

---

## Remaining — Post-Launch Optimization (Not Blocking)

These items do NOT block the presentation and should be addressed after launch. See `POST_LAUNCH_ROADMAP.md` for details.

| Item | Priority | Effort |
|------|----------|--------|
| RSC migration (`"use client"` → Server Components) | Medium | 2-3 weeks |
| Centralized logging (CloudWatch/Sentry) | Medium | 1 day |
| CDN (CloudFront) | Medium | 2 hours |
| Load testing (k6) | Medium | 1 day |
| ECS Fargate auto-scaling | Low | 1 week |
| Redis cache layer | Low | 2 days |
| CI/CD pipeline (GitHub Actions) | Medium | 2 hours |
| Database migration SQLite → PostgreSQL (RDS) | Low | 1 day |
