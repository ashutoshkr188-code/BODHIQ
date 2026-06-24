"""Address Pydantic schemas."""

from pydantic import BaseModel, Field


class AddressBase(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=200, alias="fullName")
    phone: str = Field(..., min_length=1, max_length=20)
    street: str = Field(..., min_length=1)
    city: str = Field(..., min_length=1)
    state: str = Field(..., min_length=1)
    postal_code: str = Field(..., min_length=1, alias="postalCode")
    country: str = Field(..., min_length=1)
    is_default: bool = Field(default=False, alias="isDefault")

    model_config = {"populate_by_name": True}


class AddressCreate(AddressBase):
    pass


class AddressUpdate(BaseModel):
    full_name: str | None = Field(default=None, alias="fullName")
    phone: str | None = None
    street: str | None = None
    city: str | None = None
    state: str | None = None
    postal_code: str | None = Field(default=None, alias="postalCode")
    country: str | None = None
    is_default: bool | None = Field(default=None, alias="isDefault")

    model_config = {"populate_by_name": True}


class AddressResponse(BaseModel):
    id: str
    full_name: str
    phone: str
    street: str
    city: str
    state: str
    postal_code: str
    country: str
    is_default: bool

    model_config = {"from_attributes": True}
