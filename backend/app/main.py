"""
BODHIQ FastAPI Backend — Main Application Entry Point.
Replaces Sanity CMS with a clean REST API backed by SQLite.
"""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware

from app.core.config import get_settings
from app.db.session import init_db

# Import API routers
from app.api import products, categories, orders, addresses, users, dashboard, notify, uploads, cart, cms
from app.api import settings as settings_router

settings = get_settings()

# Ensure uploads directory exists before mounting
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup."""
    init_db()

    # Auto-seed if the DB is empty
    from app.db.seed import seed_if_empty
    seed_if_empty()

    yield


app = FastAPI(
    title="BODHIQ API",
    description="Backend API for BODHIQ luxury watch e-commerce platform",
    version="1.0.0",
    lifespan=lifespan,
)

# Request logging middleware for debugging API connectivity
import logging
from fastapi import Request
debug_logger = logging.getLogger("api_debug")
debug_logger.setLevel(logging.INFO)
# Avoid adding handlers multiple times on reload
if not debug_logger.handlers:
    file_handler = logging.FileHandler("api_debug.log", encoding="utf-8")
    file_handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
    debug_logger.addHandler(file_handler)

@app.middleware("http")
async def dbg_middleware(request: Request, call_next):
    # Skip logging for static assets and uploads to prevent log bloat
    path = request.url.path
    if path.startswith("/uploads") or path == "/favicon.ico":
        return await call_next(request)

    method = request.method
    url = str(request.url)
    headers = dict(request.headers)
    if "authorization" in headers:
        headers["authorization"] = "Bearer [REDACTED]"
    debug_logger.info(f"Incoming: {method} {url} | Headers: {headers}")
    try:
        response = await call_next(request)
        debug_logger.info(f"Response: {response.status_code} for {method} {url}")
        return response
    except Exception as e:
        debug_logger.exception(f"Exception during {method} {url}: {str(e)}")
        raise e

from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

from fastapi.encoders import jsonable_encoder

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    debug_logger.error(f"Validation error for {request.method} {request.url}: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": jsonable_encoder(exc.errors())},
    )

# Proxy headers for rate limiting behind load balancers/ALB
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts="*")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Register API routes under /api/v1
app.include_router(products.router, prefix="/api/v1")
app.include_router(categories.router, prefix="/api/v1")
app.include_router(orders.router, prefix="/api/v1")
app.include_router(addresses.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(cms.router, prefix="/api/v1")
app.include_router(notify.router, prefix="/api/v1")
app.include_router(uploads.router, prefix="/api/v1")
app.include_router(cart.router, prefix="/api/v1")
app.include_router(settings_router.router, prefix="/api/v1")


@app.get("/")
def root():
    return {"status": "ok", "service": "BODHIQ API", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}
