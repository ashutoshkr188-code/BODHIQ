"""Category API routes — CRUD with nested products."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_admin_user
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.services.category_service import category_service

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("")
def list_categories(db: Session = Depends(get_db)):
    """
    List all categories ordered by their 'order' field,
    each with up to 3 products (mirrors collectionPageQuery).
    """
    return category_service.list_categories(db)


@router.get("/{slug}")
def get_category(slug: str, db: Session = Depends(get_db)):
    """
    Get a single category by slug with ALL its products
    (mirrors categoryPageQuery).
    """
    return category_service.get_category(db, slug)


@router.post("", response_model=CategoryResponse, status_code=201)
def create_category(
    payload: CategoryCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Create a new category (admin only)."""
    return category_service.create_category(db, payload)


@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: str,
    payload: CategoryUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Update a category (admin only)."""
    return category_service.update_category(db, category_id, payload)


@router.delete("/{category_id}", status_code=204)
def delete_category(
    category_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Delete a category (admin only). Fails if products still linked."""
    return category_service.delete_category(db, category_id)
