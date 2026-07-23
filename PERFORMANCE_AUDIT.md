# BODHIQ Performance and Infrastructure Audit

This document outlines the performance and infrastructure audit findings for the BODHIQ application, covering both the Next.js frontend and the FastAPI backend ecosystem.

## Frontend (Next.js)

### Rendering Strategies (SSG vs SSR vs Client Components)
> [!WARNING]
> Almost every component and page in the `frontend` directory is explicitly marked with `"use client"`.

- **Finding**: The application heavily relies on Client Components instead of leveraging React Server Components (RSC). Pages like Cart, Checkout, Account, Dashboard, and Product listings are all rendered client-side.
- **Impact**: This negates the SEO benefits of SSR/SSG and shifts data-fetching and rendering overhead to the client. This results in larger JavaScript bundles, slower Time to Interactive (TTI), and poor Core Web Vitals.
- **Proposed Fix**: Audit the component tree. Remove `"use client"` from page-level components (`page.tsx`) and layout components. Refactor data fetching to occur on the server (using Server Components) and only use Client Components for small interactive islands (e.g., buttons, forms, carousels).

### Images and Videos Optimization
> [!CAUTION]
> The codebase extensively uses unoptimized raw HTML `<img>` tags for product images, user avatars, and promotional backgrounds instead of `next/image`.

- **Finding**: Files such as `AdminSidebar.tsx`, `PromoSection.tsx`, `Header.tsx`, and various dashboard pages rely on `<img>` tags with standard `src` attributes.
- **Impact**: Images are not automatically resized, compressed into modern formats (like WebP/AVIF), or lazy-loaded. Furthermore, the lack of explicit width/height parameters can cause severe Cumulative Layout Shifts (CLS) as images load.
- **Proposed Fix**: Replace all raw `<img>` tags with the `next/image` (`<Image />`) component. Configure remote patterns in `next.config.js` if images are hosted externally. Ensure explicit `width` and `height` properties or `fill` with `sizes` are provided.

### Client Bundles & Third-Party Scripts
> [!NOTE]
> Third-party scripts, such as Razorpay, are injected manually using standard DOM manipulation inside React components.

- **Finding**: In `RazorpayButton.tsx`, the Razorpay checkout script is loaded by manually appending a `<script>` tag to the document body within the `handlePayment` function.
- **Impact**: Manual script injection can delay interactive elements, block the main thread, or cause race conditions. It misses out on Next.js script optimizations.
- **Proposed Fix**: Use the Next.js `<Script>` component (`next/script`) with an appropriate `strategy` (e.g., `lazyOnload` or `beforeInteractive`) to load Razorpay and other external scripts efficiently.

---

## Backend & Infrastructure (FastAPI, PostgreSQL, Nginx)

### Database Connection Pooling
> [!TIP]
> The SQLAlchemy engine configuration (`session.py`) currently relies on default pooling settings which may not be adequate for production scaling.

- **Finding**: The application uses `create_engine` with `pool_pre_ping=True`, but explicit configuration for `pool_size` and `max_overflow` is missing. (Currently using SQLite, but production relies on PostgreSQL via `.env.production`).
- **Impact**: Under high concurrency, default connection pool limits might cause requests to queue or timeout if database connections are exhausted.
- **Proposed Fix**: Explicitly define `pool_size` (e.g., 20) and `max_overflow` (e.g., 10) in `create_engine` based on expected traffic and database limits.

### Nginx Caching Strategies
> [!IMPORTANT]
> Nginx caches Next.js static assets effectively but lacks proxy caching for dynamic or API responses.

- **Finding**: The `nginx.conf` properly sets a 1-year cache and immutable headers for `/_next/static/` and a 30-day cache for static `/uploads/`. However, `proxy_cache` is not configured at all. API endpoints explicitly set `no-store, no-cache`.
- **Impact**: While Next.js handles its own caching, an Nginx cache layer could significantly reduce load on the Next.js server for heavily trafficked public pages and assets.
- **Proposed Fix**: Implement `proxy_cache` in Nginx for specific Next.js public routes and configure `proxy_cache_valid` for cacheable status codes.

### Rate Limits
- **Finding**: The backend correctly implements rate limiting using `slowapi` in `main.py`. Furthermore, Nginx provides defense-in-depth rate limiting zones (`zone=api 60r/m`, `zone=notify 5r/m`, `zone=upload 10r/m`), matching backend decorators (e.g., `10/minute`, `5/minute`).
- **Impact**: Excellent protection against brute force and abuse on non-auth and sensitive endpoints.
- **Proposed Fix**: No immediate action required. Maintain this configuration and tune as traffic grows.

### Logging and Monitoring
> [!WARNING]
> While a local file-based `api_debug.log` is implemented, a comprehensive production-grade monitoring solution is absent.

- **Finding**: `main.py` configures a custom `api_debug` logger that outputs to `api_debug.log`. It explicitly filters out sensitive PII and headers (good security practice). However, there is no integration with centralized logging or application performance monitoring (APM) tools.
- **Impact**: Relying on local `.log` files in Docker containers is brittle (ephemeral storage) and makes distributed debugging difficult in production.
- **Proposed Fix**: Integrate a structured logging system (like Python's `structlog` or JSON logging) and an APM/Error Tracking solution (e.g., Sentry, Datadog, or Prometheus) to centralize logs and monitor application health.
