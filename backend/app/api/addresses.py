"""Address API routes — CRUD for user shipping addresses."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.address import AddressCreate, AddressUpdate, AddressResponse
from app.services.address_service import address_service

router = APIRouter(prefix="/addresses", tags=["Addresses"])


@router.get("", response_model=list[AddressResponse])
def list_addresses(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all addresses for the current user, default first."""
    return address_service.list_addresses(db, user)


@router.post("", response_model=AddressResponse, status_code=201)
def create_address(
    payload: AddressCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new address for the current user."""
    return address_service.create_address(db, payload, user)


@router.put("/{address_id}", response_model=AddressResponse)
def update_address(
    address_id: str,
    payload: AddressUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update an address. Users can only update their own."""
    return address_service.update_address(db, address_id, payload, user)


@router.delete("/{address_id}", status_code=204)
def delete_address(
    address_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete an address. Users can only delete their own."""
    return address_service.delete_address(db, address_id, user)
