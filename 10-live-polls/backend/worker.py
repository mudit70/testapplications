"""pika consumer — reacts to poll events (e.g. reindexing)."""

import pika

from search import reindex_poll


def on_poll_event(ch, method, properties, body):
    poll_id = int(body.decode())
    reindex_poll(poll_id)


def start_consumer():
    conn = pika.BlockingConnection()
    channel = conn.channel()
    channel.basic_consume(queue="poll.created", on_message_callback=on_poll_event)
    channel.basic_consume(queue="vote.cast", on_message_callback=on_poll_event)
    channel.start_consuming()
