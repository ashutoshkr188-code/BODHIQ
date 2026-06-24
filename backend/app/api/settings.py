"""Settings API routes — GET/PUT /settings and GET/PUT /footer."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_admin_user
from app.models.user import User
from app.schemas.settings import (
    SiteSettingsResponse, SiteSettingsUpdate,
    FooterSettingsResponse, FooterSettingsUpdate,
)
from app.services.settings_service import settings_service

router = APIRouter(tags=["Settings"])


# ── Site Settings ──────────────────────────────────────────────────────────────

@router.get("/settings", response_model=SiteSettingsResponse)
def get_settings(db: Session = Depends(get_db)):
    """Get global site settings (public — used in layout metadata)."""
    return settings_service.get_settings(db)


@router.put("/settings", response_model=SiteSettingsResponse)
def update_settings(
    payload: SiteSettingsUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Update site settings (admin only)."""
    return settings_service.update_settings(db, payload)


# ── Footer Settings ────────────────────────────────────────────────────────────

@router.get("/footer", response_model=FooterSettingsResponse)
def get_footer(db: Session = Depends(get_db)):
    """Get footer content (public — used in layout)."""
    return settings_service.get_footer(db)


@router.put("/footer", response_model=FooterSettingsResponse)
def update_footer(
    payload: FooterSettingsUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Update footer content (admin only)."""
    return settings_service.update_footer(db, payload)
