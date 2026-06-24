from sqlalchemy.orm import Session
from app.models.cart import Cart

class CartRepository:
    def get_by_user_id(self, db: Session, user_id: str):
        return db.query(Cart).filter(Cart.user_id == user_id).first()

    def create(self, db: Session, cart: Cart):
        db.add(cart)
        db.commit()
        db.refresh(cart)
        return cart

    def update(self, db: Session, cart: Cart):
        db.commit()
        db.refresh(cart)
        return cart

    def delete(self, db: Session, cart: Cart):
        db.delete(cart)
        db.commit()

cart_repo = CartRepository()
