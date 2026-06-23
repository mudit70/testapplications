"""aiohttp HTTP server for the live-polls API.

Routes mirror the fetch() URL literals in frontend/src/api.ts and
delegate to the Tortoise models, the pika queue, and Elasticsearch.
"""

import aiohttp
from aiohttp import web

import models
import queue
import search

routes = web.RouteTableDef()


@routes.get("/api/polls")
async def list_polls(request):
    polls = await models.list_polls()
    return web.json_response({"polls": [p.id for p in polls]})


@routes.get("/api/polls/{poll_id}")
async def get_poll(request):
    poll_id = int(request.match_info["poll_id"])
    poll = await models.get_poll(poll_id)
    return web.json_response({"id": poll.id, "question": poll.question})


@routes.post("/api/polls")
async def create_poll(request):
    data = await request.json()
    poll = await models.create_poll(
        data["question"], data["options"], data["created_by"]
    )
    search.index_poll(poll.id, poll.question)
    queue.publish_poll_created(poll.id)
    return web.json_response({"id": poll.id})


@routes.post("/api/polls/{poll_id}/votes")
async def cast_vote(request):
    poll_id = int(request.match_info["poll_id"])
    data = await request.json()
    poll = await models.record_vote(poll_id, data["option_index"])
    queue.publish_vote_cast(poll_id)
    return web.json_response({"id": poll.id, "votes": poll.votes})


@routes.get("/api/polls/search")
async def search_polls_route(request):
    q = request.query.get("q", "")
    hits = search.search_polls(q)
    return web.json_response(hits)


def build_app():
    app = web.Application()
    app.add_routes(routes)
    return app


if __name__ == "__main__":
    web.run_app(build_app())
