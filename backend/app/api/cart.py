from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.services.cart_service import cart_service

router = APIRouter(prefix="/cart", tags=["Cart"])


# ── Typed cart item schema (AUD-12) ──────────────────────────────────────────
class CartItemSync(BaseModel):
    product_id: str = Field(..., max_length=36)
    name: str = Field(..., max_length=200)
    quantity: int = Field(..., ge=1, le=100)
    price: Decimal = Field(..., gt=0)


class SyncCartRequest(BaseModel):
    items: list[CartItemSync] = Field(..., max_length=50)


# ── Verify-total request (AUD-15) ─────────────────────────────────────────────
class VerifyTotalItem(BaseModel):
    product_id: str = Field(..., max_length=36)
    quantity: int = Field(..., ge=1, le=100)


class VerifyTotalRequest(BaseModel):
    items: list[VerifyTotalItem] = Field(..., max_length=50)


@router.get("")
def get_cart(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get the current user's cart."""
    return cart_service.get_cart(db, user)


@router.put("/sync")
def sync_cart(
    payload: SyncCartRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Sync the frontend cart items with the backend."""
    return cart_service.sync_cart(db, user, [item.model_dump() for item in payload.items])


@router.delete("")
def clear_cart(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Clear the cart completely."""
    return cart_service.clear_cart(db, user)


@router.post("/verify-total")
def verify_cart_total(
    payload: VerifyTotalRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Return the authoritative cart total computed from real DB prices.
    Used by the Razorpay order creation route so the payment amount
    cannot be tampered with on the client side. (AUD-15)
    """
    from app.repositories.product_repo import product_repo

    total = Decimal("0")
    for item in payload.items:
        product = product_repo.get_by_id(db, item.product_id)
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if not product.in_stock:
            raise HTTPException(status_code=400, detail=f"'{product.name}' is out of stock")
        if item.quantity <= 0:
            raise HTTPException(status_code=400, detail="Quantity must be at least 1")
        total += product.price * item.quantity

    return {"total": float(total), "currency": "INR"}

