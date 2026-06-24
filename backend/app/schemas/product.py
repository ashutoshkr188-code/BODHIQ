"""Product Pydantic schemas for request/response validation."""

from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: str | None = None
    price: Decimal = Field(..., gt=0)
    original_price: Decimal | None = None
    stock: int = Field(default=10, ge=0)
    in_stock: bool = True
    allow_notify: bool = True
    main_image_url: str | None = None
    images: list[str] | None = None
    product_video_url: str | None = None
    category_id: str
    case_size: str | None = None
    dial_color: str | None = None
    strap_material: str | None = None
    case_material: str | None = None
    movement: str | None = None
    water_resistance: str | None = None
    glass_type: str | None = None
    seo_meta_title: str | None = None
    seo_meta_description: str | None = None
    seo_keywords: list[str] | None = None


class ProductCreate(ProductBase):
    slug: str | None = None  # Auto-generated if not provided


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: Decimal | None = Field(default=None, gt=0)
    original_price: Decimal | None = None
    stock: int | None = Field(default=None, ge=0)
    in_stock: bool | None = None
    allow_notify: bool | None = None
    main_image_url: str | None = None
    images: list[str] | None = None
    product_video_url: str | None = None
    category_id: str | None = None
    case_size: str | None = None
    dial_color: str | None = None
    strap_material: str | None = None
    case_material: str | None = None
    movement: str | None = None
    water_resistance: str | None = None
    glass_type: str | None = None
    seo_meta_title: str | None = None
    seo_meta_description: str | None = None
    seo_keywords: list[str] | None = None


class ProductResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: str | None = None
    price: Decimal
    original_price: Decimal | None = None
    stock: int
    in_stock: bool
    allow_notify: bool
    main_image_url: str | None = None
    images: list[str] | None = None
    product_video_url: str | None = None
    category_id: str
    category: str | None = None  # Category title, populated in queries
    case_size: str | None = None
    dial_color: str | None = None
    strap_material: str | None = None
    case_material: str | None = None
    movement: str | None = None
    water_resistance: str | None = None
    glass_type: str | None = None
    seo_meta_title: str | None = None
    seo_meta_description: str | None = None
    seo_keywords: list[str] | None = None
    created_at: datetime | None = None

    model_config = {"from_attributes": True}


class ProductListItem(BaseModel):
    """Lightweight product for list views."""
    id: str
    name: str
    slug: str
    price: Decimal
    original_price: Decimal | None = None
    stock: int
    in_stock: bool
    allow_notify: bool
    main_image_url: str | None = None

    model_config = {"from_attributes": True}
