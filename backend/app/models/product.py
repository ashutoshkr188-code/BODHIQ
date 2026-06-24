"""Product model — watches with specs, pricing, media, and SEO."""

import uuid
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import String, Text, Integer, Boolean, DateTime, Numeric, JSON, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Pricing
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    original_price: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)

    # Stock
    stock: Mapped[int] = mapped_column(Integer, default=10)
    in_stock: Mapped[bool] = mapped_column(Boolean, default=True)
    allow_notify: Mapped[bool] = mapped_column(Boolean, default=True)

    # Media
    main_image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    images: Mapped[list | None] = mapped_column(JSON, nullable=True)  # list of URL strings
    product_video_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # Category relationship
    category_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("categories.id"), nullable=False
    )

    # Watch-specific specs
    case_size: Mapped[str | None] = mapped_column(String(50), nullable=True)
    dial_color: Mapped[str | None] = mapped_column(String(50), nullable=True)
    strap_material: Mapped[str | None] = mapped_column(String(100), nullable=True)
    case_material: Mapped[str | None] = mapped_column(String(100), nullable=True)
    movement: Mapped[str | None] = mapped_column(String(100), nullable=True)
    water_resistance: Mapped[str | None] = mapped_column(String(50), nullable=True)
    glass_type: Mapped[str | None] = mapped_column(String(100), nullable=True)

    # SEO
    seo_meta_title: Mapped[str | None] = mapped_column(String(200), nullable=True)
    seo_meta_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    seo_keywords: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    category = relationship("Category", back_populates="products")

    __table_args__ = (
        Index("ix_products_slug", "slug"),
        Index("ix_products_category_id", "category_id"),
        Index("ix_products_created_at", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<Product {self.name} ₹{self.price}>"
