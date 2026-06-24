"""Category Pydantic schemas."""

from datetime import datetime
from pydantic import BaseModel, Field


class CategoryBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = None
    feature_title: str | None = None
    reverse: bool = False
    order: int = 1
    feature_image_url: str | None = None
    feature_video_url: str | None = None
    seo_meta_title: str | None = None
    seo_meta_description: str | None = None
    seo_keywords: list[str] | None = None


class CategoryCreate(CategoryBase):
    slug: str | None = None


class CategoryUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    feature_title: str | None = None
    reverse: bool | None = None
    order: int | None = None
    feature_image_url: str | None = None
    feature_video_url: str | None = None
    seo_meta_title: str | None = None
    seo_meta_description: str | None = None
    seo_keywords: list[str] | None = None


class CategoryResponse(CategoryBase):
    id: str
    slug: str
    created_at: datetime | None = None

    model_config = {"from_attributes": True}


class CategoryWithProducts(CategoryResponse):
    """Category with its products included."""
    products: list = []  # Will be ProductListItem instances
