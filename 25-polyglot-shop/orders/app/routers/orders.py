from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.db import get_db
from app.events import publish_order_placed
from app.inventory_client import OutOfStock, release_stock, reserve_stock
from app.models import Order, OrderItem
from app.schemas import AddressUpdate, OrderItemOut, OrderOut, PlaceOrder

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.get("", response_model=list[OrderOut])
def list_orders(db: Session = Depends(get_db)) -> list[Order]:
    return list(db.scalars(select(Order).order_by(Order.created_at.desc()).limit(50)))


@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db)) -> OrderOut:
    order = db.get(Order, order_id)
    if order is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "order not found")
    items = db.scalars(select(OrderItem).where(OrderItem.order_id == order_id)).all()
    out = OrderOut.model_validate(order)
    out.items = [OrderItemOut.model_validate(i) for i in items]
    return out


@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
async def place_order(body: PlaceOrder, db: Session = Depends(get_db)) -> Order:
    try:
        reservation = await reserve_stock(body.items)
    except OutOfStock as exc:
        raise HTTPException(status.HTTP_409_CONFLICT, str(exc)) from exc

    order = Order(customer_email=body.customer_email, status="placed", total_cents=reservation["total_cents"])
    db.add(order)
    db.flush()
    db.add_all(
        [
            OrderItem(order_id=order.id, product_id=line.product_id, quantity=line.quantity, reservation_id=rid)
            for line, rid in zip(body.items, reservation["reservation_ids"], strict=True)
        ]
    )
    db.commit()

    await publish_order_placed(order.id, reservation["reservation_ids"])
    return order


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_order(order_id: int, db: Session = Depends(get_db)) -> Response:
    order = db.get(Order, order_id)
    if order is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "order not found")
    if order.status != "placed":
        raise HTTPException(status.HTTP_409_CONFLICT, f"order is {order.status}")

    items = db.scalars(select(OrderItem).where(OrderItem.order_id == order_id)).all()
    for item in items:
        await release_stock(item.reservation_id)

    db.execute(update(Order).where(Order.id == order_id).values(status="cancelled"))
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# Left from the first checkout, which let customers change the address after ordering.
# Nothing calls it any more.
@router.put("/{order_id}/address", response_model=OrderOut)
def update_address(order_id: int, body: AddressUpdate, db: Session = Depends(get_db)) -> Order:
    db.execute(update(Order).where(Order.id == order_id).values(shipping_address=body.shipping_address))
    db.commit()
    order = db.get(Order, order_id)
    if order is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "order not found")
    return order
