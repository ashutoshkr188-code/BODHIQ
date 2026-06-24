from sqlalchemy.orm import Session
from sqlalchemy import func, case

from app.models.user import User
from app.models.product import Product
from app.models.order import Order

class DashboardRepository:
    def get_aggregate_stats(self, db: Session):
        total_users = db.query(User).count()
        total_products = db.query(Product).count()
        
        order_stats = db.query(
            func.count(Order.id).label("total_orders"),
            func.sum(case((Order.status == "pending", 1), else_=0)).label("pending_orders"),
            func.sum(case((Order.status.in_(["paid", "shipped", "delivered"]), Order.amount), else_=0)).label("total_revenue")
        ).first()

        return {
            "total_users": total_users,
            "total_products": total_products,
            "total_orders": (order_stats.total_orders or 0) if order_stats else 0,
            "pending_orders": int(order_stats.pending_orders or 0) if order_stats else 0,
            "total_revenue": float(order_stats.total_revenue or 0) if order_stats else 0.0,
        }

    def get_recent_orders(self, db: Session, limit: int = 10):
        return (
            db.query(Order)
            .order_by(Order.created_at.desc())
            .limit(limit)
            .all()
        )

dashboard_repo = DashboardRepository()
