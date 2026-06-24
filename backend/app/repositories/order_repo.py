from sqlalchemy.orm import Session
from app.models.order import Order, OrderItem

class OrderRepository:
    def get_by_user_id(self, db: Session, user_id: str):
        return db.query(Order).filter(Order.user_id == user_id).order_by(Order.created_at.desc()).all()

    def get_by_id(self, db: Session, order_id: str):
        return db.query(Order).filter(Order.id == order_id).first()

    def get_paginated(self, db: Session, page: int, per_page: int, status: str | None = None):
        query = db.query(Order)
        if status:
            query = query.filter(Order.status == status)
        
        total = query.count()
        orders = (
            query.order_by(Order.created_at.desc())
            .offset((page - 1) * per_page)
            .limit(per_page)
            .all()
        )
        return total, orders

    def create(self, db: Session, order: Order, items: list[OrderItem]):
        db.add(order)
        for item in items:
            db.add(item)
        db.commit()
        db.refresh(order)
        return order

    def update(self, db: Session, order: Order):
        db.commit()
        db.refresh(order)
        return order

order_repo = OrderRepository()
