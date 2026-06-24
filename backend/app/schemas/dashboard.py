"""Dashboard analytics schemas."""

from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_users: int
    total_products: int
    total_orders: int
    total_revenue: float
    pending_orders: int
    recent_orders: list[dict]
