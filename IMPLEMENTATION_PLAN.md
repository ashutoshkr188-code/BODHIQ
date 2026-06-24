# IMPLEMENTATION_PLAN.md — BODHIQ Backend Rebuild

> **Goal:** Replace/complete the existing FastAPI backend so it perfectly supports the frontend.
> **Approach:** Fix existing code + add missing pieces. Do not break what works.

---

## Current State Assessment

The existing backend is **well-structured** and **mostly correct**. The new backend does NOT need to be written from scratch. Instead, we need to:

1. ✅ Fix 5 critical missing endpoints
2. ✅ Fix 1 URL prefix mismatch (dashboard/stats)
3. ✅ Add 2 missing DB models + tables
4. ✅ Fix JWT audience verification
5. ✅ Wire the product delete button
6. ✅ Build 4 missing admin dashboard pages (Users, Media, Footer, Settings)
7. ✅ Add category CRUD to dashboard

---

## Step-by-Step Implementation

---

### STEP 1 — Fix Dashboard Stats URL Mismatch
**File:** `backend/app/api/dashboard.py`
- Change router prefix from `/admin/dashboard` → `/dashboard`
- Frontend calls: `GET /api/v1/dashboard/stats`

---

### STEP 2 — Add SiteSettings DB Model
**File:** `backend/app/models/settings.py` [NEW]
- `SiteSettings` table (singleton, id=1)
- `FooterSettings` table (singleton, id=1)
- Fields matching frontend `SiteSettings` and `FooterSettings` types

---

### STEP 3 — Add Settings Schemas
**File:** `backend/app/schemas/settings.py` [NEW]
- `SiteSettingsResponse` — with camelCase aliases to match frontend
- `SiteSettingsUpdate`
- `FooterSettingsResponse`
- `FooterSettingsUpdate`

---

### STEP 4 — Add Settings Repository
**File:** `backend/app/repositories/settings_repo.py` [NEW]
- `get_or_create_settings(db)` → SiteSettings
- `update_settings(db, payload)` → SiteSettings
- `get_or_create_footer(db)` → FooterSettings
- `update_footer(db, payload)` → FooterSettings

---

### STEP 5 — Add Settings Service
**File:** `backend/app/services/settings_service.py` [NEW]
- `get_settings(db)` → returns singleton with defaults
- `update_settings(db, payload)`
- `get_footer(db)` → returns singleton with defaults
- `update_footer(db, payload)`

---

### STEP 6 — Add Settings API Routes
**File:** `backend/app/api/settings.py` [NEW]
```
GET  /api/v1/settings     → public, returns SiteSettings
PUT  /api/v1/settings     → admin only
GET  /api/v1/footer       → public, returns FooterSettings
PUT  /api/v1/footer       → admin only
```

---

### STEP 7 — Register New Routes in main.py
**File:** `backend/app/main.py` [MODIFY]
- Import `settings` router
- Add `app.include_router(settings.router, prefix="/api/v1")`

---

### STEP 8 — Register Settings Models for Alembic
**File:** `backend/app/models/__init__.py` [MODIFY]
- Import `SiteSettings`, `FooterSettings` from `settings.py`

---

### STEP 9 — Update Seed Data
**File:** `backend/app/db/seed.py` [MODIFY]
- Add default `SiteSettings` row (id=1)
- Add default `FooterSettings` row (id=1) with company links, quick links, social links

---

### STEP 10 — Fix JWT Audience Verification
**File:** `backend/app/core/security.py` [MODIFY]
- Disable `verify_aud` in `jwt.decode()` options
- Clerk JWTs may not include audience claim; this causes auth failures

---

### STEP 11 — Add Category `_id` to Response
**File:** `backend/app/services/category_service.py` [MODIFY]
- In `_format_category_with_products()`, add `"_id": cat.id` to response dict
- In product items within response, add `"_id": p.id`
- This fixes the frontend `CollectionPageClient.tsx` and `CategoryPageClient.tsx` which use `_id`

---

### STEP 12 — Add Alembic Migration for New Tables
**File:** `alembic/versions/002_add_settings_tables.py` [NEW]
- `op.create_table("site_settings", ...)`
- `op.create_table("footer_settings", ...)`

---

### STEP 13 — Frontend: Wire Product Delete
**File:** `frontend/src/app/dashboard/products/page.tsx` [MODIFY]
- Import `adminDeleteProduct` from dashboard API
- Wire delete button to call API and refresh list
- Remove "coming soon" toast

---

### STEP 14 — Frontend: Add adminDeleteProduct API Function
**File:** `frontend/src/features/dashboard/api/index.ts` [MODIFY]
```typescript
export async function adminDeleteProduct(token: string, id: string): Promise<void> {
  await routeFetch<void>(`/products/${id}`, token, { method: "DELETE" });
}
```

---

### STEP 15 — Backend: Add notify_requests List Endpoint
**File:** `backend/app/api/notify.py` [MODIFY]
- Add `GET /notify/admin/all` — paginated list of notify requests for admin

---

### STEP 16 — Frontend: Users Dashboard Page
**File:** `frontend/src/app/dashboard/users/page.tsx` [NEW]
- Full CRUD-like user management page
- Table: Name | Email | Role | Joined | Actions
- Role dropdown (user/admin)
- Search by name/email
- Calls `GET /api/v1/users/admin/all` and `PUT /api/v1/users/admin/{id}/role`

---

### STEP 17 — Frontend: Media Library Dashboard Page
**File:** `frontend/src/app/dashboard/media/page.tsx` [NEW]
- Drag-and-drop multi-file upload zone
- Grid of uploaded files (images as thumbnails, videos with play icon)
- Copy URL button
- Calls `POST /api/v1/upload/multiple`

---

### STEP 18 — Frontend: Footer Dashboard Page
**File:** `frontend/src/app/dashboard/footer/page.tsx` [NEW]
- Footer settings editor
- Newsletter section, company links, quick links, social links
- Calls `GET/PUT /api/v1/footer`

---

### STEP 19 — Frontend: Settings Dashboard Page
**File:** `frontend/src/app/dashboard/settings/page.tsx` [NEW]
- SEO title, description, keywords
- Contact email
- Logo text
- Calls `GET/PUT /api/v1/settings`

---

### STEP 20 — Frontend: Update AdminSidebar
**File:** `frontend/src/features/dashboard/components/AdminSidebar.tsx` [MODIFY]
- Add new nav items: Users, Media, Footer, Settings
- Point to new routes: `/dashboard/users`, `/dashboard/media`, `/dashboard/footer`, `/dashboard/settings`

---

### STEP 21 — Frontend: Add Dashboard API Functions
**File:** `frontend/src/features/dashboard/api/index.ts` [MODIFY]
- `adminGetUsers(token, page)` → `GET /users/admin/all`
- `adminUpdateUserRole(token, id, role)` → `PUT /users/admin/{id}/role`
- `getSettings(token)` → `GET /settings`
- `updateSettings(token, payload)` → `PUT /settings`
- `getFooterSettings(token)` → `GET /footer`
- `updateFooterSettings(token, payload)` → `PUT /footer`

---

### STEP 22 — Quick Action Links Fix
**File:** `frontend/src/app/dashboard/page.tsx` [MODIFY]
- Update Quick Actions to include valid routes (`/dashboard/users`, `/dashboard/media`)
- Remove broken `/dashboard/content` → change to `/dashboard/content` or fix link

---

### STEP 23 — Final Verification
**Actions:**
1. Run backend: `uvicorn app.main:app --reload`
2. Confirm all endpoints respond correctly
3. Run frontend: `npm run dev`
4. Test homepage loads (settings + footer + hero + philosophy)
5. Test collection page loads
6. Test product page loads
7. Test dashboard login (admin role)
8. Test dashboard stats
9. Test product create/edit/delete
10. Test order status update

---

## Files Summary

### New Backend Files
| File | Status |
|------|--------|
| `backend/app/models/settings.py` | NEW |
| `backend/app/schemas/settings.py` | NEW |
| `backend/app/repositories/settings_repo.py` | NEW |
| `backend/app/services/settings_service.py` | NEW |
| `backend/app/api/settings.py` | NEW |
| `alembic/versions/002_add_settings_tables.py` | NEW |

### Modified Backend Files
| File | Changes |
|------|---------|
| `backend/app/api/dashboard.py` | Fix prefix: `/admin/dashboard` → `/dashboard` |
| `backend/app/main.py` | Register settings router |
| `backend/app/models/__init__.py` | Import new models |
| `backend/app/core/security.py` | Disable verify_aud |
| `backend/app/services/category_service.py` | Add `_id` to response |
| `backend/app/db/seed.py` | Add settings + footer defaults |
| `backend/app/api/notify.py` | Add admin list endpoint |

### New Frontend Files
| File | Status |
|------|--------|
| `frontend/src/app/dashboard/users/page.tsx` | NEW |
| `frontend/src/app/dashboard/media/page.tsx` | NEW |
| `frontend/src/app/dashboard/footer/page.tsx` | NEW |
| `frontend/src/app/dashboard/settings/page.tsx` | NEW |

### Modified Frontend Files
| File | Changes |
|------|---------|
| `frontend/src/features/dashboard/api/index.ts` | Add delete, users, settings, footer functions |
| `frontend/src/features/dashboard/components/AdminSidebar.tsx` | Add new nav items |
| `frontend/src/app/dashboard/products/page.tsx` | Wire delete button |
| `frontend/src/app/dashboard/page.tsx` | Fix quick action links |

---

## Execution Order

```
Phase A: Backend Fixes (Steps 1-12)   ← Critical path: makes frontend work
Phase B: Frontend Fixes (Steps 13-14) ← Wires existing feature
Phase C: New Dashboard Pages (Steps 15-22) ← Admin completeness
Phase D: Verification (Step 23)
```

---

## Risk Assessment

| Risk | Level | Mitigation |
|------|-------|------------|
| JWT auth failures | HIGH | Disable verify_aud in security.py |
| Settings endpoints missing | HIGH | Steps 2-9 add them |
| Dashboard stats 404 | HIGH | Step 1 fixes prefix |
| _id vs id mismatch | MEDIUM | Step 11 adds _id alias |
| DB schema migration | LOW | Alembic handles it cleanly |
| Delete product | LOW | Simple API wire |
