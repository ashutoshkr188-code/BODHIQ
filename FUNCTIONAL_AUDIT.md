# 🔍 FUNCTIONAL_AUDIT.md — Phase 2: Functional Completeness & Data Integrity

## EXECUTIVE SUMMARY
The BODHIQ platform has a strong foundation, and previous critical gaps (missing `/settings` and `/footer` endpoints, un-wired product deletion, etc.) have been resolved. However, several data shape mismatches exist between the frontend types and backend API responses, which silently drop data (like category featured images) in the UI.

---

## 1. FRONTEND ↔ BACKEND CONTRACT VALIDATION

### 1.1 Category Data Shape Mismatch (Silent Failure)
- **Severity**: 🔴 Critical (Breaks UI)
- **Location**: `frontend/src/app/collection/page.tsx` Lines 14-17 & `frontend/src/types/api.ts` Line 43
- **Finding**: The backend returns `feature_image_url`, `feature_video_url`, and `feature_title` (snake_case). However, the frontend `collection/page.tsx` maps the categories by looking for `cat.featureImage`, `cat.featureVideo`, and `cat.featureTitle`. These are `undefined` on the `cat` object returned by the API, causing featured category media to silently fail to render.
- **Fix**: Update the `Category` interface in `api.ts` to strictly match the backend (snake_case), and update the mapping in `collection/page.tsx` to read `cat.feature_image_url`, `cat.feature_video_url`, and `cat.feature_title`.

### 1.2 Lingering `_id` Legacy
- **Severity**: 🟡 Major
- **Location**: `frontend/src/types/api.ts` (Multiple interfaces), `cartStore.ts`, `addressStore.ts`
- **Finding**: The frontend heavily relies on `_id` internally for local state (zustand stores) and components (e.g., `ProductPageClient`), despite the backend moving to strict `id` fields. `api.ts` uses `_id?: string` as a workaround. While mapped safely in `product/[slug]/page.tsx`, this dual `id`/`_id` usage is highly prone to bugs (especially in cart/checkout when sending payloads to backend).
- **Fix**: Perform a wholesale refactor to remove `_id` entirely. Update all components, Zustand stores, and types to strictly use `id`.

---

## 2. CRITICAL USER FLOWS & EDGE CASES

### 2.1 Cart Price Sync
- **Severity**: 🟢 Minor
- **Location**: `frontend/src/hooks/cartStore.ts`
- **Finding**: The cart uses `localStorage` (via Zustand persist). If a product's price is updated by an admin in the dashboard, the user's cart will still display the old price. The new `verify-total` endpoint (added in Phase 1) will correctly catch this and throw a `400` error during checkout, preventing loss of funds, but it results in a poor UX.
- **Fix**: Add a `sync_prices` check when loading the cart page or resuming a session to refresh prices from the backend.

### 2.2 Unhandled 401 Token Expiry
- **Severity**: 🟡 Major
- **Location**: `frontend/src/lib/apiClient.ts` (routeFetch)
- **Finding**: If a Clerk JWT token expires mid-session, the backend throws a `401 Unauthorized` on protected routes. `routeFetch` simply throws a generic HTTP Error (`throw new Error(...)`), which triggers a generic React Error Boundary.
- **Fix**: Add a specific interceptor for `401` status codes in `apiClient.ts` to smoothly redirect the user to `/sign-in` or trigger a Clerk token refresh.

### 2.3 Dashboard Concurrent Edits
- **Severity**: 🟢 Minor
- **Location**: `backend/app/api/products.py`
- **Finding**: There is no optimistic locking (e.g., `updated_at` versioning check) for admin dashboard updates. Last write wins silently.
- **Fix**: Implement an `updated_at` version check constraint in the `adminUpdateProduct` service.

---

## FINAL VERDICT
The core application functionality is intact, but the category media shape mismatch must be fixed immediately. The legacy `_id` pattern should also be fully excised from the codebase to ensure robust data integrity in the cart and checkout flows.
