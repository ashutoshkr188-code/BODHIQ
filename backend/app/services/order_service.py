import math
import time
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories.order_repo import order_repo
from app.models.order import Order, OrderItem
from app.models.user import User
from app.schemas.order import OrderCreate, OrderStatusUpdate, OrderResponse
from app.core.logger import get_logger

logger = get_logger(__name__)

class OrderService:
    def get_user_orders(self, db: Session, user: User):
        orders = order_repo.get_by_user_id(db, user.id)
        return [OrderResponse.model_validate(o) for o in orders]

    def get_order(self, db: Session, order_id: str, user: User):
        order = order_repo.get_by_id(db, order_id)
        if not order:
            logger.warning(f"Order not found: {order_id} requested by user: {user.id}")
            raise HTTPException(status_code=404, detail="Order not found")

        if user.role != "admin" and order.user_id != user.id:
            logger.warning(f"Access denied: User {user.id} attempted to access order {order_id}")
            raise HTTPException(status_code=403, detail="Access denied")

        return OrderResponse.model_validate(order)

    def create_order(self, db: Session, payload: OrderCreate, user: User):
        from app.repositories.product_repo import product_repo
        
        order_number = f"ORD-{int(time.time())}"
        
        # Calculate secure total from database prices
        calculated_total = 0
        items = []
        secure_cart_items = []
        
        for item in payload.cart_items:
            if item.quantity <= 0:
                raise HTTPException(status_code=400, detail=f"Invalid quantity for {item.name}")
                
            product = product_repo.get_by_id(db, item.product_id)
            if not product:
                raise HTTPException(status_code=404, detail=f"Product not found: {item.name}")
                
            line_total = product.price * item.quantity
            calculated_total += line_total
            
            # Use secure DB price instead of payload price
            secure_cart_items.append({
                "product_id": item.product_id,
                "name": product.name,
                "quantity": item.quantity,
                "price": float(product.price)
            })
            
            items.append(OrderItem(
                name=product.name,
                quantity=item.quantity,
                price=product.price,
            ))

        order = Order(
            order_number=order_number,
            razorpay_order_id=payload.razorpay_order_id,
            razorpay_payment_id=payload.razorpay_payment_id,
            user_id=user.id,
            customer_name=payload.customer_name,
            customer_email=payload.customer_email,
            amount=calculated_total,
            currency=payload.currency,
            status="paid",
            cart_items=secure_cart_items,
            shipping_address=payload.shipping_address.model_dump(),
        )

        for item in items:
            item.order_id = order.id

        try:
            order = order_repo.create(db, order, items)
            logger.info(f"Successfully created order {order.order_number} for user {user.id}")
            return OrderResponse.model_validate(order)
        except Exception as e:
            logger.error(f"Failed to create order {order_number} for user {user.id}: {str(e)}", exc_info=True)
            db.rollback()
            raise HTTPException(status_code=500, detail="Failed to process order")

    def update_order_status(self, db: Session, order_id: str, payload: OrderStatusUpdate):
        order = order_repo.get_by_id(db, order_id)
        if not order:
            logger.warning(f"Failed to update status. Order not found: {order_id}")
            raise HTTPException(status_code=404, detail="Order not found")

        order.status = payload.status
        order = order_repo.update(db, order)
        logger.info(f"Order {order_id} status updated to {payload.status}")
        return OrderResponse.model_validate(order)

    def admin_list_orders(self, db: Session, page: int, per_page: int, status: str | None):
        total, orders = order_repo.get_paginated(db, page, per_page, status)
        
        return {
            "items": [OrderResponse.model_validate(o).model_dump() for o in orders],
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": math.ceil(total / per_page) if total > 0 else 0,
        }

order_service = OrderService()
