"""Order API routes — user orders + admin management."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_user, get_admin_user
from app.models.user import User
from app.schemas.order import OrderCreate, OrderStatusUpdate, OrderResponse
from app.services.order_service import order_service

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("", response_model=list[OrderResponse])
def get_user_orders(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all orders for the current authenticated user."""
    return order_service.get_user_orders(db, user)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific order. Users can only access their own orders."""
    return order_service.get_order(db, order_id, user)


@router.post("", response_model=OrderResponse, status_code=201)
def create_order(
    payload: OrderCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new order after payment verification."""
    return order_service.create_order(db, payload, user)


@router.put("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: str,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Update order status (admin only)."""
    return order_service.update_order_status(db, order_id, payload)


# Admin endpoint for listing all orders
@router.get("/admin/all", response_model=dict)
def admin_list_orders(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: str | None = Query(None),
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """List all orders (admin only) with pagination."""
    return order_service.admin_list_orders(db, page, per_page, status)
