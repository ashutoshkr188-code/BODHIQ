"""User Pydantic schemas."""

from datetime import datetime
from pydantic import BaseModel


class UserResponse(BaseModel):
    id: str
    clerk_id: str
    email: str
    first_name: str | None = None
    last_name: str | None = None
    image_url: str | None = None
    role: str
    created_at: datetime | None = None

    model_config = {"from_attributes": True}


class UserRoleUpdate(BaseModel):
    role: str  # "user" or "admin"
