"""Kafka consumer that drains the sensor reading topics."""

from kafka import KafkaConsumer

from readings_store import insert_reading, record_alert


def consume_readings() -> None:
    consumer = KafkaConsumer(
        'sensor-readings',
        bootstrap_servers='localhost:9092',
    )
    for msg in consumer:
        insert_reading(msg.key, float(msg.value))


def consume_alerts() -> None:
    consumer = KafkaConsumer(bootstrap_servers='localhost:9092')
    consumer.subscribe(['sensor-alerts'])
    for msg in consumer:
        record_alert(msg.key, msg.value.decode())
