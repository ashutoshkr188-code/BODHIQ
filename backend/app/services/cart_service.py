from sqlalchemy.orm import Session
from app.models.cart import Cart
from app.models.user import User
from app.repositories.cart_repo import cart_repo

class CartService:
    def get_cart(self, db: Session, user: User):
        cart = cart_repo.get_by_user_id(db, user.id)
        if not cart:
            cart = Cart(user_id=user.id, items=[])
            cart = cart_repo.create(db, cart)
        return {"items": cart.items}

    def sync_cart(self, db: Session, user: User, items: list):
        cart = cart_repo.get_by_user_id(db, user.id)
        if not cart:
            cart = Cart(user_id=user.id, items=items)
            cart = cart_repo.create(db, cart)
        else:
            cart.items = items
            cart = cart_repo.update(db, cart)
        return {"items": cart.items}

    def clear_cart(self, db: Session, user: User):
        cart = cart_repo.get_by_user_id(db, user.id)
        if cart:
            cart.items = []
            cart_repo.update(db, cart)
        return {"items": []}

cart_service = CartService()
