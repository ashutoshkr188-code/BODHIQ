"""Dashboard API — admin analytics endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_admin_user
from app.models.user import User
from app.schemas.dashboard import DashboardStats
from app.services.dashboard_service import dashboard_service

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Get aggregate dashboard statistics."""
    return dashboard_service.get_dashboard_stats(db)
