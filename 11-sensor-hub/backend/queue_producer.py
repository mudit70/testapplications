"""Kafka producer for the sensor reading ingestion pipeline."""

from kafka import KafkaProducer

producer = KafkaProducer(bootstrap_servers='localhost:9092')


def publish_reading(payload: bytes) -> None:
    producer.send('sensor-readings', value=payload)


def publish_alert(payload: bytes) -> None:
    producer.send(topic='sensor-alerts', value=payload)
