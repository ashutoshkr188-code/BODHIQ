from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.services.cart_service import cart_service

router = APIRouter(prefix="/cart", tags=["Cart"])

class SyncCartRequest(BaseModel):
    items: list

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
    return cart_service.sync_cart(db, user, payload.items)

@router.delete("")
def clear_cart(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Clear the cart completely."""
    return cart_service.clear_cart(db, user)
