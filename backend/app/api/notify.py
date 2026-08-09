"""Notify-me (back in stock) API route."""

import math
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_user, get_admin_user
from app.models.notify import BackInStockRequest
from app.models.user import User

router = APIRouter(prefix="/notify", tags=["Notifications"])


class NotifyRequest(BaseModel):
    product_id: str
    product_name: str
    product_slug: str
    email: str


class BackInStockResponse(BaseModel):
    id: str
    product_id: str
    product_name: str
    product_slug: str
    email: str
    clerk_user_id: str | None = None
    requested_at: datetime

    model_config = {"from_attributes": True}


@router.post("")
def create_notify_request(
    payload: NotifyRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit a back-in-stock notification request."""
    existing = (
        db.query(BackInStockRequest)
        .filter(
            BackInStockRequest.product_id == payload.product_id,
            BackInStockRequest.email == payload.email,
        )
        .first()
    )

    if existing:
        return {"success": True, "message": "Already subscribed for this product."}

    request = BackInStockRequest(
        product_id=payload.product_id,
        product_name=payload.product_name,
        product_slug=payload.product_slug,
        email=payload.email,
        clerk_user_id=user.clerk_id,
    )
    db.add(request)
    db.commit()

    return {"success": True, "message": "Notification request saved."}


@router.get("/admin/all")
def get_all_notify_requests(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    user: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    """Retrieve all back-in-stock notification requests (Admin only)."""
    total = db.query(BackInStockRequest).count()
    requests = (
        db.query(BackInStockRequest)
        .order_by(BackInStockRequest.requested_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )

    return {
        "items": [BackInStockResponse.model_validate(r).model_dump() for r in requests],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": math.ceil(total / per_page) if total > 0 else 0,
    }

