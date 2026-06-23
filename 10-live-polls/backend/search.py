"""Elasticsearch client — index & search polls."""

from elasticsearch import Elasticsearch

es = Elasticsearch("http://localhost:9200")


def index_poll(poll_id: int, question: str):
    return es.index(index="polls", id=str(poll_id), document={"question": question})


def search_polls(query: str):
    return es.search(index="polls", body={"query": {"match": {"question": query}}})


def get_poll_doc(poll_id: int):
    return es.get(index="polls", id=str(poll_id))


def reindex_poll(poll_id: int):
    return es.update(index="polls", id=str(poll_id), body={"doc": {"reindexed": True}})


def count_polls():
    return es.count(index="polls")
