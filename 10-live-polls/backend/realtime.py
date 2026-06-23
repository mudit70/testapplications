"""websockets server — pushes live poll results to clients."""

import asyncio

import websockets
from websockets import serve

from models import get_poll


async def live_handler(ws):
    async for msg in ws:
        poll_id = int(msg)
        poll = await get_poll(poll_id)
        await ws.send(str(poll.votes))


async def serve_live():
    async with serve(live_handler, "localhost", 8765):
        await asyncio.Future()
