"""pika (RabbitMQ) producer — publishes poll lifecycle events."""

import pika


def publish_poll_created(poll_id: int):
    conn = pika.BlockingConnection()
    channel = conn.channel()
    channel.basic_publish(
        exchange="polls",
        routing_key="poll.created",
        body=str(poll_id).encode(),
    )


def publish_vote_cast(poll_id: int):
    conn = pika.BlockingConnection()
    channel = conn.channel()
    channel.basic_publish(
        exchange="polls",
        routing_key="vote.cast",
        body=str(poll_id).encode(),
    )
