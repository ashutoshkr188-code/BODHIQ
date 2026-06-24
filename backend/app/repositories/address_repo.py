from sqlalchemy.orm import Session
from app.models.address import Address

class AddressRepository:
    def get_user_addresses(self, db: Session, user_id: str):
        return (
            db.query(Address)
            .filter(Address.user_id == user_id)
            .order_by(Address.is_default.desc(), Address.created_at.desc())
            .all()
        )

    def get_by_id_and_user(self, db: Session, address_id: str, user_id: str):
        return (
            db.query(Address)
            .filter(Address.id == address_id, Address.user_id == user_id)
            .first()
        )

    def unset_default_for_user(self, db: Session, user_id: str):
        db.query(Address).filter(
            Address.user_id == user_id, Address.is_default == True
        ).update({"is_default": False})

    def create(self, db: Session, address: Address):
        db.add(address)
        db.commit()
        db.refresh(address)
        return address

    def update(self, db: Session, address: Address):
        db.commit()
        db.refresh(address)
        return address

    def delete(self, db: Session, address: Address):
        db.delete(address)
        db.commit()

address_repo = AddressRepository()
