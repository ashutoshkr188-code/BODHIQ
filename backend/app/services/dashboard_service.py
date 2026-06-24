from sqlalchemy.orm import Session
from app.repositories.dashboard_repo import dashboard_repo
from app.schemas.dashboard import DashboardStats

class DashboardService:
    def get_dashboard_stats(self, db: Session):
        stats = dashboard_repo.get_aggregate_stats(db)

        recent = dashboard_repo.get_recent_orders(db)
        recent_orders = [
            {
                "id": o.id,
                "order_number": o.order_number,
                "customer_name": o.customer_name,
                "amount": float(o.amount),
                "status": o.status,
                "created_at": o.created_at.isoformat() if o.created_at else None,
            }
            for o in recent
        ]

        return DashboardStats(
            total_users=stats["total_users"],
            total_products=stats["total_products"],
            total_orders=stats["total_orders"],
            total_revenue=stats["total_revenue"],
            pending_orders=stats["pending_orders"],
            recent_orders=recent_orders,
        )

dashboard_service = DashboardService()
