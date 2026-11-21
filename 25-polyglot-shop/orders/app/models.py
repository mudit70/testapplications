from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)
    customer_email: Mapped[str] = mapped_column(String(320))
    status: Mapped[str] = mapped_column(String(16), default="placed")
    total_cents: Mapped[int] = mapped_column(Integer)
    shipping_address: Mapped[str | None] = mapped_column(String(500))
    # Set by the carrier integration when the parcel ships; none of these services write it.
    tracking_url: Mapped[str | None] = mapped_column(String(2048))
    payment_id: Mapped[int | None] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    product_id: Mapped[int] = mapped_column(Integer)
    quantity: Mapped[int] = mapped_column(Integer)
    # The stock inventory holds for this line until the order is placed or cancelled.
    reservation_id: Mapped[int] = mapped_column(Integer)
