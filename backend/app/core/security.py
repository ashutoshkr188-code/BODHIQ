"""
Clerk JWT verification and user extraction.
Fetches JWKS from Clerk and validates Bearer tokens.
"""

import time
from dataclasses import dataclass

import httpx
from jose import jwt, JWTError

from app.core.config import get_settings

import logging

logger = logging.getLogger(__name__)

# Abstract Cache Layer for JWKS (Ready for Redis)
class JWKSCache:
    def __init__(self):
        self._cache: dict | None = None
        self._fetched_at: float = 0
        self.ttl = 3600  # 1 hour
        # TODO: Initialize redis client here when scaling horizontally
        # self.redis = redis.Redis(...)

    def get(self) -> dict | None:
        now = time.time()
        if self._cache and (now - self._fetched_at) < self.ttl:
            return self._cache
        # TODO: Implement redis fallback here
        return None

    def set(self, jwks: dict):
        self._cache = jwks
        self._fetched_at = time.time()
        # TODO: Set in redis here

jwks_cache = JWKSCache()


@dataclass
class ClerkUser:
    """Represents an authenticated Clerk user extracted from JWT."""
    clerk_id: str
    email: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    image_url: str | None = None


async def get_jwks(force_refresh: bool = False) -> dict:
    """Fetch JWKS from Clerk, checking cache first."""
    if not force_refresh:
        cached = jwks_cache.get()
        if cached:
            return cached

    settings = get_settings()
    jwks_url = settings.CLERK_JWKS_URL

    if not jwks_url:
        raise ValueError("CLERK_JWKS_URL is not configured")

    async with httpx.AsyncClient() as client:
        response = await client.get(jwks_url)
        response.raise_for_status()
        jwks = response.json()
        jwks_cache.set(jwks)
        return jwks


async def verify_clerk_token(token: str) -> ClerkUser:
    """
    Verify a Clerk JWT token and extract user information.

    Args:
        token: The JWT Bearer token from the Authorization header.

    Returns:
        ClerkUser with extracted claims.

    Raises:
        ValueError: If the token is invalid or expired.
    """
    try:
        jwks = await get_jwks()

        # Decode the JWT header to find the key ID
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")

        if not kid:
            raise ValueError("Token missing key ID (kid)")

        # Find the matching key
        rsa_key = None
        for key in jwks.get("keys", []):
            if key.get("kid") == kid:
                rsa_key = key
                break

        if not rsa_key:
            # Clear cache and retry once in case keys rotated
            jwks = await get_jwks(force_refresh=True)

            for key in jwks.get("keys", []):
                if key.get("kid") == kid:
                    rsa_key = key
                    break

        if not rsa_key:
            raise ValueError("Unable to find matching signing key")

        # Verify and decode the token
        settings = get_settings()
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=["RS256"],
            options={"verify_aud": False},  # Clerk tokens don't include audience claim
        )

        clerk_id = payload.get("sub")
        if not clerk_id:
            raise ValueError("Token missing subject (sub) claim")

        return ClerkUser(
            clerk_id=clerk_id,
            email=payload.get("email"),
            first_name=payload.get("first_name"),
            last_name=payload.get("last_name"),
            image_url=payload.get("image_url"),
        )

    except JWTError as e:
        raise ValueError(f"Invalid token: {str(e)}")
