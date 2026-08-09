# ─── BODHIQ FastAPI Backend — Production Dockerfile ───────────────────────────
# Multi-stage build: deps → builder → final
# Base: python:3.12-slim for minimal attack surface

# ── Stage 1: Dependency installer ────────────────────────────────────────────
FROM python:3.12-slim AS deps

WORKDIR /install

# Install system dependencies needed by some Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install into a prefix directory
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install/deps -r requirements.txt


# ── Stage 2: Final runtime image ─────────────────────────────────────────────
FROM python:3.12-slim AS final

# Runtime system deps (libpq for PostgreSQL)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN groupadd -r bodhiq && useradd -r -g bodhiq -d /app -s /sbin/nologin bodhiq

WORKDIR /app

# Copy installed Python packages from deps stage
COPY --from=deps /install/deps /usr/local

# Copy application source
COPY --chown=bodhiq:bodhiq . .

# Create uploads directory with correct ownership
RUN mkdir -p /app/uploads && chown bodhiq:bodhiq /app/uploads

# Switch to non-root user
USER bodhiq

# Expose port
EXPOSE 8000

# Health check — AWS ECS / ALB will use this
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Production start: uvicorn with 4 workers
# gunicorn manages workers; uvicorn is the ASGI worker class
CMD ["python", "-m", "uvicorn", "app.main:app", \
     "--host", "0.0.0.0", \
     "--port", "8000", \
     "--workers", "4", \
     "--proxy-headers", \
     "--forwarded-allow-ips", "*", \
     "--no-access-log"]
