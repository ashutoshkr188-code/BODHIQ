"""Order Pydantic schemas."""

from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel, Field


class CartItemSchema(BaseModel):
    product_id: str
    name: str
    quantity: int = Field(..., ge=1)
    price: Decimal


class ShippingAddressSchema(BaseModel):
    fullName: str
    street: str
    city: str
    state: str
    postalCode: str
    country: str
    phone: str


class OrderCreate(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    customer_name: str
    customer_email: str
    amount: Decimal
    currency: str = "INR"
    cart_items: list[CartItemSchema]
    shipping_address: ShippingAddressSchema


class OrderStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(pending|paid|shipped|delivered|cancelled)$")


class OrderResponse(BaseModel):
    id: str
    order_number: str
    razorpay_order_id: str | None = None
    razorpay_payment_id: str | None = None
    customer_name: str
    customer_email: str
    amount: Decimal
    currency: str
    status: str
    cart_items: list[dict] | None = None
    shipping_address: dict | None = None
    created_at: datetime | None = None

    model_config = {"from_attributes": True}
