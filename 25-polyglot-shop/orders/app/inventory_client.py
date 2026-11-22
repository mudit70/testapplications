"""Calls to the inventory service, which holds stock for an order until it is placed."""

import os

import httpx

from app.schemas import OrderLine

INVENTORY_URL = os.environ["INVENTORY_URL"]


class OutOfStock(Exception):
    pass


async def reserve_stock(items: list[OrderLine]) -> dict:
    """Reserves every line; inventory answers with one reservation id per line and the total."""
    async with httpx.AsyncClient(timeout=5.0) as client:
        resp = await client.post(
            f"{INVENTORY_URL}/api/reservations",
            json={"items": [item.model_dump() for item in items]},
        )
    if resp.status_code == 409:
        raise OutOfStock(resp.json().get("error", "out of stock"))
    resp.raise_for_status()
    return resp.json()


async def release_stock(reservation_id: int) -> None:
    async with httpx.AsyncClient(timeout=5.0) as client:
        resp = await client.delete(f"{INVENTORY_URL}/api/reservations/{reservation_id}")
    if resp.status_code != 404:
        resp.raise_for_status()
