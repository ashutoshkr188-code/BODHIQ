"""Product API routes — CRUD + featured products."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_admin_user
from app.models.user import User
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse, ProductListItem
from app.services.product_service import product_service

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=dict)
def list_products(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    category: str | None = Query(None, description="Filter by category slug"),
    db: Session = Depends(get_db),
):
    """List all products with pagination and optional category filter."""
    return product_service.list_products(db, page, per_page, category)


@router.get("/featured", response_model=list[ProductListItem])
def featured_products(db: Session = Depends(get_db)):
    """Get the 4 most recently added products for the featured section."""
    return product_service.get_featured(db)


@router.get("/{slug}", response_model=ProductResponse)
def get_product(slug: str, db: Session = Depends(get_db)):
    """Get a single product by its slug, with category name included."""
    return product_service.get_product(db, slug)


@router.post("", response_model=ProductResponse, status_code=201)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Create a new product (admin only)."""
    return product_service.create_product(db, payload)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: str,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Update a product (admin only)."""
    return product_service.update_product(db, product_id, payload)


@router.delete("/{product_id}", status_code=204)
def delete_product(
    product_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Delete a product (admin only)."""
    return product_service.delete_product(db, product_id)
