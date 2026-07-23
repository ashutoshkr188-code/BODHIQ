# 🔒 BODHIQ Security Audit Report

**Date**: July 23, 2026  
**Scope**: Full-stack security review — FastAPI backend, Next.js frontend, Nginx reverse proxy, Docker infrastructure  
**Severity Legend**: 🔴 Critical · 🟡 Medium · 🟢 Low / Informational

---

## Executive Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | 5 |
| 🟡 Medium | 11 |
| 🟢 Low | 8 |
| **Total** | **24** |

The BODHIQ codebase has a solid architectural foundation — Clerk JWT authentication, Pydantic validation, parameterized ORM queries, non-root Docker containers, and security headers in both Nginx and Next.js. However, several critical gaps remain, primarily around **missing Razorpay payment verification on the backend**, **unauthenticated Razorpay order creation**, **overly permissive proxy-header trust**, a **missing Content-Security-Policy in Nginx**, and a **weak CSP in Next.js**.

---

## 1. Authentication & Authorization (Clerk JWT + FastAPI)

### 🟡 AUD-01 — JWT Audience Verification Disabled

**File**: `backend/app/core/security.py:121`

```python
payload = jwt.decode(
    token,
    rsa_key,
    algorithms=["RS256"],
    options={"verify_aud": False},  # audience not verified
)
```

**Risk**: A JWT issued for a different Clerk application sharing the same JWKS keys could be accepted. While Clerk typically isolates keys per application, disabling audience verification removes a defense-in-depth check.

**Fix**: If your Clerk JWT includes an `aud` claim (check via jwt.io), verify it:
```python
payload = jwt.decode(
    token,
    rsa_key,
    algorithms=["RS256"],
    audience="your-clerk-frontend-api-url",
    options={"verify_aud": True},
)
```
If Clerk truly doesn't emit `aud`, keep `verify_aud: False` but add a comment documenting why.

---

### 🟡 AUD-02 — JWT Issuer (`iss`) Not Verified

**File**: `backend/app/core/security.py:117-122`

```python
payload = jwt.decode(
    token,
    rsa_key,
    algorithms=["RS256"],
    options={"verify_aud": False},
    # No issuer verification
)
```

**Risk**: Without verifying `iss`, a token from another Clerk instance using the same signing key format could be accepted.

**Fix**: Add issuer verification:
```python
payload = jwt.decode(
    token,
    rsa_key,
    algorithms=["RS256"],
    issuer="https://choice-pegasus-73.clerk.accounts.dev",
    options={"verify_aud": False},
)
```

---

### 🟢 AUD-03 — Role Authorization Uses String Comparison

**File**: `backend/app/core/deps.py:120`

```python
if user.role != "admin":
```

**Risk**: Magic strings for roles. Not a direct vulnerability, but a typo (e.g., `"Admin"` vs `"admin"`) could bypass access control.

**Fix**: Use an enum:
```python
from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"
```

---

### 🟢 AUD-04 — Admin Self-Demotion Not Prevented

**File**: `backend/app/api/users.py:46-64`

```python
def admin_update_role(user_id: str, payload: UserRoleUpdate, ...):
    # No check preventing admin from demoting themselves
    user.role = payload.role
```

**Risk**: An admin can accidentally demote themselves, potentially locking out the last admin.

**Fix**: Add a guard:
```python
if user.id == admin.id and payload.role != "admin":
    raise HTTPException(400, "Cannot change your own role")
```

---

## 2. API Security

### 🟡 AUD-05 — No Rate Limiting on Backend API Routes

**File**: `backend/app/main.py:30`

```python
limiter = Limiter(key_func=get_remote_address)
```

**Risk**: The `slowapi` limiter is initialized and the exception handler is registered (line 88-89), but **no `@limiter.limit()` decorators are applied to any route**. Rate limiting is Nginx-only. If someone bypasses Nginx (e.g., internal network, direct port access), the backend has zero rate limiting.

**Fix**: Apply limits to sensitive routes:
```python
from app.main import limiter

@router.post("")
@limiter.limit("10/minute")
async def create_order(request: Request, ...):
    ...
```

---

### 🔴 AUD-06 — Unauthenticated Razorpay Order Creation

**File**: `frontend/src/app/api/razorpay/order/route.ts:5`

```typescript
export async function POST(req: Request) {
  const body = await req.json();
  const { amount } = body;
  // No authentication check — anyone can create Razorpay orders
  const order = await razorpay.orders.create(options);
```

**Risk**: **Any unauthenticated user can create unlimited Razorpay orders** with arbitrary amounts. An attacker can flood your Razorpay account with fake orders, potentially causing billing issues or hitting Razorpay rate limits.

**Fix**: Add Clerk authentication:
```typescript
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ... rest of handler
}
```

---

### 🔴 AUD-07 — No Server-Side Razorpay Payment Verification on Backend

**File**: `backend/app/services/order_service.py:31-90`

```python
def create_order(self, db: Session, payload: OrderCreate, user: User):
    # No Razorpay signature verification
    # No Razorpay API call to confirm payment status
    order = Order(
        razorpay_order_id=payload.razorpay_order_id,
        razorpay_payment_id=payload.razorpay_payment_id,
        status="paid",  # immediately set to "paid" without verification
    )
```

**Risk**: **The backend trusts the frontend completely for payment status**. Signature verification happens only in the Next.js route handler (`frontend/src/app/api/razorpay/verify/route.ts`). An attacker who calls `POST /api/v1/orders` directly with fabricated `razorpay_order_id` and `razorpay_payment_id` values can **create "paid" orders without actually paying**. This is a critical financial vulnerability.

**Fix**: Add server-side payment verification in the backend:
```python
import httpx

def create_order(self, db, payload, user):
    settings = get_settings()
    
    # Verify with Razorpay API
    resp = httpx.get(
        f"https://api.razorpay.com/v1/payments/{payload.razorpay_payment_id}",
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET),
    )
    payment = resp.json()
    
    if payment.get("status") != "captured":
        raise HTTPException(400, "Payment not confirmed")
    
    if float(payment.get("amount", 0)) / 100 != float(calculated_total):
        raise HTTPException(400, "Amount mismatch")
    
    # ... proceed with order creation
```

---

### 🟡 AUD-08 — Order Status Transition Not Validated

**File**: `backend/app/services/order_service.py:92-101`

```python
def update_order_status(self, db, order_id, payload):
    order.status = payload.status  # any valid status allowed
```

**Risk**: While the schema restricts to valid status values via regex pattern, there is no state-machine validation. An admin could set a "delivered" order back to "pending" or a "cancelled" order to "paid".

**Fix**: Add transition validation:
```python
VALID_TRANSITIONS = {
    "pending": {"paid", "cancelled"},
    "paid": {"shipped", "cancelled"},
    "shipped": {"delivered"},
    "delivered": set(),
    "cancelled": set(),
}
if payload.status not in VALID_TRANSITIONS.get(order.status, set()):
    raise HTTPException(400, f"Cannot transition from {order.status} to {payload.status}")
```

---

### 🟡 AUD-09 — Order Number Collision Risk

**File**: `backend/app/services/order_service.py:34`

```python
order_number = f"ORD-{int(time.time())}"
```

**Risk**: Two orders created in the same second will have the same `order_number`, causing a database unique constraint violation (500 error). `time.time()` returns seconds since epoch — collisions are likely under concurrent load.

**Fix**: Use a higher-precision timestamp or UUID:
```python
import uuid
order_number = f"ORD-{int(time.time() * 1000)}-{uuid.uuid4().hex[:6]}"
```

---

### 🟢 AUD-10 — CORS Allows All Methods and Headers

**File**: `backend/app/main.py:106-111`

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Risk**: While origins are properly restricted via env, `allow_methods=["*"]` and `allow_headers=["*"]` are overly broad. This allows methods like `TRACE`, `OPTIONS` from any origin that matches.

**Fix**: Restrict to only needed methods and headers:
```python
allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
allow_headers=["Authorization", "Content-Type"],
```

---

### 🟢 AUD-11 — FastAPI Docs Not Disabled in Production App

**File**: `backend/app/main.py:45-50`

```python
app = FastAPI(
    title="BODHIQ API",
    # docs_url and redoc_url not disabled
)
```

**Risk**: Nginx blocks `/docs` and `/redoc` (lines 132-137), but the FastAPI app itself still serves them. If someone accesses the backend directly (port 8000), full API documentation is exposed.

**Fix**: Disable docs in production:
```python
import os

app = FastAPI(
    title="BODHIQ API",
    docs_url=None if os.getenv("ENV") == "production" else "/docs",
    redoc_url=None if os.getenv("ENV") == "production" else "/redoc",
    openapi_url=None if os.getenv("ENV") == "production" else "/openapi.json",
)
```

---

### 🟡 AUD-12 — Cart Sync Accepts Unvalidated Arbitrary JSON

**File**: `backend/app/api/cart.py:11-12`

```python
class SyncCartRequest(BaseModel):
    items: list  # untyped list, accepts anything
```

**And**: `backend/app/services/cart_service.py:14`
```python
def sync_cart(self, db, user, items: list):
    cart.items = items  # stored as-is in JSON column
```

**Risk**: No validation on cart item structure. An attacker can store arbitrary JSON payloads (XSS payloads, massive data) in the database. If cart items are rendered on the frontend without sanitization, this is a stored XSS vector.

**Fix**: Define a proper schema:
```python
class CartItemSync(BaseModel):
    product_id: str = Field(..., max_length=36)
    name: str = Field(..., max_length=200)
    quantity: int = Field(..., ge=1, le=100)
    price: Decimal = Field(..., gt=0)

class SyncCartRequest(BaseModel):
    items: list[CartItemSync] = Field(..., max_length=50)
```

---

## 3. File Upload Security

### 🟡 AUD-13 — No MIME Type / Magic Byte Validation

**File**: `backend/app/api/uploads.py:29-34`

```python
ext = os.path.splitext(file.filename or "")[1].lower()
if ext not in ALLOWED_EXTENSIONS:
    raise HTTPException(...)
```

**Risk**: Only the file extension is checked. An attacker can upload a malicious file (e.g., HTML with JavaScript) by renaming it to `.jpg`. While FastAPI's StaticFiles serves with the proper MIME type based on extension, this is defense-in-depth.

**Fix**: Add magic-byte validation:
```python
import magic  # python-magic

MIME_WHITELIST = {
    "image/jpeg", "image/png", "image/webp", "image/gif",
    "video/mp4", "video/webm", "video/quicktime",
}

content = await file.read()
mime = magic.from_buffer(content[:2048], mime=True)
if mime not in MIME_WHITELIST:
    raise HTTPException(400, f"File content type {mime} not allowed")
```

---

### 🟢 AUD-14 — Uploaded Files Served Without Content-Disposition Header

**File**: `backend/app/main.py:114`

```python
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")
```

**Risk**: Uploaded media is served inline by default. If a user manages to upload an HTML file (despite extension checks), the browser may execute it.

**Fix**: The Nginx `X-Content-Type-Options: nosniff` header helps, but consider adding a custom middleware that sets `Content-Disposition: inline` only for genuine image/video MIME types.

---

## 4. Razorpay Payment Security

### 🔴 AUD-15 — Client-Controlled Amount in Razorpay Order Creation

**File**: `frontend/src/app/api/razorpay/order/route.ts:7-18`

```typescript
const { amount } = body;          // amount comes from client
const options = {
    amount: Math.round(amount * 100),  // directly used
};
const order = await razorpay.orders.create(options);
```

**Risk**: **The payment amount is entirely client-controlled.** An attacker can modify the request to create a Razorpay order for ₹1 instead of the actual cart total. The backend's `order_service.py` calculates the total from DB prices (good), but the Razorpay order is created with the client-supplied amount. This means the customer pays ₹1 via Razorpay, the signature verification passes (it's valid for ₹1), and the backend creates an order for the full DB-price amount — but the actual payment was ₹1.

**Fix**: Calculate the amount server-side from the cart:
```typescript
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId, getToken } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = await getToken();
  const body = await req.json();
  const { cartItems } = body;

  // Fetch real prices from backend
  const verifiedTotal = await routeFetch<{ total: number }>(
    "/cart/verify-total",
    token!,
    { method: "POST", body: JSON.stringify({ items: cartItems }) }
  );

  const options = {
    amount: Math.round(verifiedTotal.total * 100),
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };
  // ...
}
```

---

### 🟡 AUD-16 — Razorpay Key Secret Non-Null Assertion Without Validation

**File**: `frontend/src/lib/razorpay.ts:4-5`

```typescript
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});
```

**Risk**: If `RAZORPAY_KEY_SECRET` is not set, the `!` operator will pass `undefined` to Razorpay, which may result in cryptic errors or weakened signature verification.

**Fix**: Add startup validation:
```typescript
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set");
}

export const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
```

---

### 🔴 AUD-17 — Cart Items Missing `product_id` in Verify Route Payload

**File**: `frontend/src/app/api/razorpay/verify/route.ts:65-70`

```typescript
cart_items: (cartItems ?? []).map(
  (item: { name: string; quantity: number; price: number }) => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    // product_id is missing!
  })
),
```

**Risk**: The backend `OrderCreate` schema requires `product_id` in `CartItemSchema`. The verify route strips it out during mapping, which would cause a **422 validation error** — meaning orders from the normal checkout flow may fail silently or crash.

**Fix**: Include `product_id` in the mapping:
```typescript
cart_items: (cartItems ?? []).map(
  (item: { product_id: string; name: string; quantity: number; price: number }) => ({
    product_id: item.product_id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  })
),
```

---

## 5. Infrastructure Security (Nginx, Docker)

### 🟡 AUD-18 — Missing `Content-Security-Policy` in Nginx

**File**: `nginx/nginx.conf:68-72`

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
# No Content-Security-Policy header
# No Strict-Transport-Security header
```

**Risk**: While Next.js adds its own CSP and HSTS headers, the Nginx proxy should also set these for API responses and static assets that don't go through Next.js (like `/uploads/`).

**Fix**: Add to the server block:
```nginx
add_header Content-Security-Policy "default-src 'self'; img-src 'self' data: https:; script-src 'none'; style-src 'none'" always;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
```

---

### 🔴 AUD-19 — ProxyHeadersMiddleware Trusts All Hosts

**File**: `backend/app/main.py:102`

```python
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts="*")
```

**Risk**: **Any client can set `X-Forwarded-For` and `X-Forwarded-Proto` headers to spoof their IP address.** This makes the `slowapi` rate limiter (which uses `get_remote_address`) completely bypassable — an attacker just rotates spoofed IPs. It also makes audit logs unreliable.

**Fix**: Restrict to known proxy IPs:
```python
# Docker internal network + ALB CIDR
app.add_middleware(
    ProxyHeadersMiddleware,
    trusted_hosts=["172.16.0.0/12", "10.0.0.0/8", "127.0.0.1"]
)
```

---

### 🟢 AUD-20 — Security Headers Lost in Sub-locations

**File**: `nginx/nginx.conf:75-85` and `nginx/nginx.conf:156-161`

```nginx
location /uploads/ {
    add_header Cache-Control "public, max-age=2592000, immutable";
    # Security headers from server block are NOT inherited because
    # Nginx's add_header in a child block replaces parent block headers
}

location /_next/static/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
    # Same issue — security headers are lost
}
```

**Risk**: Nginx's `add_header` directive in a child `location` block **replaces** (not appends to) all `add_header` directives from the parent block. The `/uploads/`, `/_next/static/`, and `/api/v1/` locations all lose `X-Frame-Options`, `X-Content-Type-Options`, etc.

**Fix**: Repeat security headers in every location block, or use `include` with a shared snippet:
```nginx
# /etc/nginx/security-headers.conf
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Then in each location:
location /uploads/ {
    include /etc/nginx/security-headers.conf;
    add_header Cache-Control "public, max-age=2592000, immutable";
    ...
}
```

---

### 🟢 AUD-21 — Nginx Dockerfile Runs as Root (nginx User)

**File**: `nginx/Dockerfile:1-16`

```dockerfile
FROM nginx:1.27-alpine
# No USER directive — runs as root, then drops to 'nginx' worker
```

**Risk**: The master process runs as root. While the `user nginx;` directive in `nginx.conf` ensures worker processes run as `nginx`, the master process remains root. This is a minor concern in a containerized environment.

**Fix**: Consider using `nginxinc/nginx-unprivileged` image:
```dockerfile
FROM nginxinc/nginx-unprivileged:1.27-alpine
```

> **Note**: The backend and frontend Dockerfiles correctly use non-root users (`bodhiq` and `nextjs` respectively). This is good.

---

## 6. Data Security & PII

### 🟡 AUD-22 — Debug Logger Logs All Request Headers

**File**: `backend/app/main.py:72-75`

```python
headers = dict(request.headers)
if "authorization" in headers:
    headers["authorization"] = "Bearer [REDACTED]"
debug_logger.info(f"Incoming: {method} {url} | Headers: {headers}")
```

**Risk**: While `Authorization` is redacted (good), **all other headers are logged**, including potentially sensitive ones like `Cookie`, `X-Forwarded-For` (PII — IP address), and any custom headers. The log is written to `api_debug.log` on disk.

**Fix**: Whitelist logged headers:
```python
SAFE_HEADERS = {"content-type", "accept", "user-agent", "host", "origin"}
safe = {k: v for k, v in request.headers.items() if k.lower() in SAFE_HEADERS}
debug_logger.info(f"Incoming: {method} {url} | Headers: {safe}")
```

---

### 🟡 AUD-23 — Validation Errors May Leak PII

**File**: `backend/app/main.py:94-99`

```python
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    debug_logger.error(f"Validation error for {request.method} {request.url}: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": jsonable_encoder(exc.errors())},
    )
```

**Risk**: Validation errors return raw field-level details to the client, which could include information about internal field names, expected types, and data patterns. The log also writes the full error (which may contain the actual PII values that failed validation — e.g., malformed email addresses, phone numbers).

**Fix**: Sanitize before logging:
```python
debug_logger.error(f"Validation error for {request.method} {request.url.path}: {len(exc.errors())} field(s)")
```

---

### 🟡 AUD-24 — Order Response Exposes Full Shipping Address Including Phone

**File**: `backend/app/schemas/order.py:40-54`

```python
class OrderResponse(BaseModel):
    customer_name: str
    customer_email: str
    shipping_address: dict | None = None  # full address including phone
```

**Risk**: The full order response, including customer email, name, and full shipping address (with phone number), is returned for both user endpoints and admin list endpoints. While access-controlled, minimizing PII exposure is best practice.

**Fix**: Create separate schemas for user-facing and admin views. Consider masking phone numbers in the user response (`***-***-1234`).

---

## 7. Frontend Security

### 🟡 AUD-25 — Weak Content Security Policy

**File**: `frontend/next.config.ts:34-43`

```typescript
"script-src 'self' 'unsafe-eval' 'unsafe-inline' https:; " +
```

**Risk**: `'unsafe-eval'` and `'unsafe-inline'` in `script-src` effectively neuters CSP against XSS attacks. `https:` as a source allows loading scripts from any HTTPS origin.

**Fix**: Remove `'unsafe-eval'` and use nonces for inline scripts:
```typescript
"script-src 'self' 'nonce-${nonce}' https://checkout.razorpay.com; " +
```
Note: `'unsafe-inline'` may be needed for some frameworks; if so, use `'strict-dynamic'` with nonces instead.

---

### 🟢 AUD-26 — `dangerouslySetInnerHTML` Usage is Safe (JSON-LD Only)

**Files**:
- `frontend/src/app/layout.tsx:130`
- `frontend/src/app/product/[slug]/page.tsx:120`

```tsx
dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
```

**Risk**: Low — the content is `JSON.stringify()` of hardcoded or server-sourced structured data. `JSON.stringify()` escapes HTML special characters. No user input flows into these directly. However, if product names ever contain `</script>`, `JSON.stringify` alone does not escape this.

**Fix**: Use a proper JSON-LD escaping function:
```typescript
const safeJson = JSON.stringify(jsonLd).replace(/</g, '\\u003c');
```

---

### 🟢 AUD-27 — Frontend Notify-Me Route Bypasses Backend Auth

**File**: `frontend/src/app/api/notify-me/route.ts:24-37`

```typescript
// Forward directly to FastAPI — no auth token needed for this endpoint
const result = await fetch(`${API_URL}/api/v1/notify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ... }),
});
```

But the **backend** `POST /api/v1/notify` route at `backend/app/api/notify.py:36-38` **requires authentication**:
```python
user: User = Depends(get_current_user),  # requires auth
```

**Risk**: The frontend comment says "no auth token needed" but the backend **does** require auth. This means the notify-me flow is silently broken — it will return 401 errors.

**Fix**: Either:
1. Add auth to the frontend route (pass Clerk token), or
2. Remove `get_current_user` dependency from the backend notify endpoint if it's intended to be public.

---

## 8. Additional Security Concerns

### 🟢 AUD-28 — `promote_user.py` Script with Direct DB Access in Repo

**File**: `promote_user.py`

**Risk**: This admin promotion script uses raw SQLite queries and Clerk API calls. While it's not deployed (it's a local tool), it's in the repo root and could be accidentally included in Docker images.

**Fix**: Add to `.dockerignore` files and move to a `scripts/` directory:
```
# .dockerignore
promote_user.py
```

---

## Summary of Positives

The codebase has several security best practices already in place:

| Area | Implementation |
|------|----------------|
| **JWT Auth** | Proper JWKS-based RS256 verification with key rotation support |
| **SQL Injection** | All queries use SQLAlchemy ORM — no raw SQL with user input |
| **Input Validation** | Pydantic schemas with `Field(gt=0)`, `Field(ge=1)`, regex patterns |
| **Server-Side Price** | Order total calculated from DB prices, not client-submitted prices |
| **Non-Root Docker** | Backend (`bodhiq` user) and frontend (`nextjs` user) run as non-root |
| **Multi-stage Builds** | Minimal production images with only runtime dependencies |
| **CORS Origins** | Configurable via env variable, not hardcoded to `*` |
| **Nginx Rate Limiting** | Three zones: `api` (60r/m), `notify` (5r/m), `upload` (10r/m) |
| **Security Headers** | Both Nginx and Next.js set X-Frame-Options, X-Content-Type-Options, etc. |
| **Auth Redaction** | Authorization header redacted in debug logs |
| **File Upload Limits** | Extension allowlist + 50MB size limit |
| **`.gitignore`** | Properly excludes `.env`, `.env.local`, `*.db`, and log files |
| **HSTS** | Set in Next.js config with preload and includeSubDomains |
| **Sensitive Ports** | Backend and frontend use `expose` (not `ports`) in Docker Compose |

---

## Priority Action Items

### Immediate (Pre-Launch) 🔴

| # | Finding | Effort |
|---|---------|--------|
| AUD-07 | Add backend Razorpay payment verification | 2-3 hrs |
| AUD-15 | Server-side amount calculation for Razorpay orders | 2 hrs |
| AUD-06 | Add auth to Razorpay order creation route | 30 min |
| AUD-19 | Restrict ProxyHeadersMiddleware trusted_hosts | 15 min |
| AUD-17 | Fix missing `product_id` in verify route | 15 min |

### Short-Term (Sprint 1) 🟡

| # | Finding | Effort |
|---|---------|--------|
| AUD-01 | Verify JWT audience if available | 30 min |
| AUD-02 | Add JWT issuer verification | 15 min |
| AUD-05 | Add slowapi decorators to backend routes | 1 hr |
| AUD-08 | Add order status transition validation | 1 hr |
| AUD-12 | Add cart item schema validation | 30 min |
| AUD-13 | Add MIME type validation for uploads | 1 hr |
| AUD-18 | Add CSP and HSTS to Nginx | 30 min |
| AUD-20 | Fix Nginx header inheritance in sub-locations | 30 min |
| AUD-22 | Restrict logged headers to safe whitelist | 15 min |
| AUD-23 | Sanitize validation error logging | 15 min |
| AUD-25 | Strengthen Next.js CSP (remove unsafe-eval) | 1-2 hrs |

### Nice-to-Have 🟢

| # | Finding | Effort |
|---|---------|--------|
| AUD-03 | Use enum for user roles | 30 min |
| AUD-04 | Prevent admin self-demotion | 15 min |
| AUD-09 | Fix order number collision risk | 15 min |
| AUD-10 | Restrict CORS methods/headers | 15 min |
| AUD-11 | Disable FastAPI docs in production | 15 min |
| AUD-14 | Add Content-Disposition for uploads | 30 min |
| AUD-21 | Use nginx-unprivileged image | 15 min |
| AUD-24 | Mask PII in order responses | 1 hr |
