from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories.address_repo import address_repo
from app.models.address import Address
from app.models.user import User
from app.schemas.address import AddressCreate, AddressUpdate, AddressResponse

class AddressService:
    def list_addresses(self, db: Session, user: User):
        addresses = address_repo.get_user_addresses(db, user.id)
        return [AddressResponse.model_validate(a) for a in addresses]

    def create_address(self, db: Session, payload: AddressCreate, user: User):
        if payload.is_default:
            address_repo.unset_default_for_user(db, user.id)

        address = Address(
            user_id=user.id,
            full_name=payload.full_name,
            phone=payload.phone,
            street=payload.street,
            city=payload.city,
            state=payload.state,
            postal_code=payload.postal_code,
            country=payload.country,
            is_default=payload.is_default,
        )
        address = address_repo.create(db, address)
        return AddressResponse.model_validate(address)

    def update_address(self, db: Session, address_id: str, payload: AddressUpdate, user: User):
        address = address_repo.get_by_id_and_user(db, address_id, user.id)
        if not address:
            raise HTTPException(status_code=404, detail="Address not found")

        update_data = payload.model_dump(exclude_unset=True)

        if update_data.get("is_default"):
            address_repo.unset_default_for_user(db, user.id)

        for field, value in update_data.items():
            setattr(address, field, value)

        address = address_repo.update(db, address)
        return AddressResponse.model_validate(address)

    def delete_address(self, db: Session, address_id: str, user: User):
        address = address_repo.get_by_id_and_user(db, address_id, user.id)
        if not address:
            raise HTTPException(status_code=404, detail="Address not found")

        address_repo.delete(db, address)

address_service = AddressService()
