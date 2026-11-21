from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class OrderLine(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class PlaceOrder(BaseModel):
    customer_email: EmailStr
    items: list[OrderLine] = Field(min_length=1)


class AddressUpdate(BaseModel):
    shipping_address: str


class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    product_id: int
    quantity: int
    reservation_id: int


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    customer_email: str
    status: str
    total_cents: int
    tracking_url: str | None
    created_at: datetime
    items: list[OrderItemOut] = []
