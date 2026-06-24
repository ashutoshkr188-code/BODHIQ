"""BackInStockRequest model — notify-me subscriptions for out-of-stock products."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import String, DateTime, ForeignKey, Index, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class BackInStockRequest(Base):
    __tablename__ = "back_in_stock_requests"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    product_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("products.id"), nullable=False
    )
    product_name: Mapped[str] = mapped_column(String(200), nullable=False)
    product_slug: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    clerk_user_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    requested_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    __table_args__ = (
        UniqueConstraint("product_id", "email", name="uq_notify_product_email"),
        Index("ix_notify_product_id", "product_id"),
        Index("ix_notify_email", "email"),
    )

    def __repr__(self) -> str:
        return f"<BackInStockRequest {self.email} → {self.product_name}>"
