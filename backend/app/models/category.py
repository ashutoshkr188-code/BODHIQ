"""Category model — product categories with media and SEO fields."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Text, Integer, Boolean, DateTime, JSON, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    feature_title: Mapped[str | None] = mapped_column(String(200), nullable=True)
    reverse: Mapped[bool] = mapped_column(Boolean, default=False)
    order: Mapped[int] = mapped_column(Integer, default=1)
    feature_image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    feature_video_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

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
    products = relationship("Product", back_populates="category", lazy="selectin")

    __table_args__ = (
        Index("ix_categories_slug", "slug"),
        Index("ix_categories_order", "order"),
    )

    def __repr__(self) -> str:
        return f"<Category {self.title}>"
