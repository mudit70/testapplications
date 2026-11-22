"""Kafka: orders publishes order.placed and consumes payment.settled."""

import json
import logging
import os

from aiokafka import AIOKafkaConsumer, AIOKafkaProducer
from sqlalchemy import update

from app.db import SessionLocal
from app.models import Order

log = logging.getLogger(__name__)

KAFKA_BOOTSTRAP = os.environ.get("KAFKA_BOOTSTRAP", "localhost:9092")
ORDER_PLACED = "order.placed"
PAYMENT_SETTLED = "payment.settled"

_producer: AIOKafkaProducer | None = None


async def start_producer() -> None:
    global _producer
    _producer = AIOKafkaProducer(
        bootstrap_servers=KAFKA_BOOTSTRAP,
        value_serializer=lambda v: json.dumps(v).encode(),
    )
    await _producer.start()


async def stop_producer() -> None:
    if _producer is not None:
        await _producer.stop()


async def publish_order_placed(order_id: int, reservation_ids: list[int]) -> None:
    assert _producer is not None, "start_producer() runs in the app's lifespan"
    await _producer.send_and_wait(
        ORDER_PLACED,
        {"order_id": order_id, "reservation_ids": reservation_ids},
        key=str(order_id).encode(),
    )


async def consume_payment_settled() -> None:
    consumer = AIOKafkaConsumer(
        PAYMENT_SETTLED,
        bootstrap_servers=KAFKA_BOOTSTRAP,
        group_id="orders",
        value_deserializer=json.loads,
    )
    await consumer.start()
    try:
        async for msg in consumer:
            event = msg.value
            mark_paid(event["order_id"], event["payment_id"])
    finally:
        await consumer.stop()


def mark_paid(order_id: int, payment_id: int) -> None:
    with SessionLocal() as db:
        result = db.execute(
            update(Order)
            .where(Order.id == order_id, Order.status == "placed")
            .values(status="paid", payment_id=payment_id)
        )
        db.commit()
    if result.rowcount == 0:
        log.warning("payment %s settled for order %s, which is not awaiting payment", payment_id, order_id)
