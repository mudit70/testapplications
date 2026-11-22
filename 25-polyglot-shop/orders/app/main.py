import asyncio
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import Base, engine
from app.events import consume_payment_settled, start_producer, stop_producer
from app.routers import orders


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    Base.metadata.create_all(engine)
    await start_producer()
    consumer = asyncio.create_task(consume_payment_settled())
    yield
    consumer.cancel()
    await stop_producer()


app = FastAPI(title="orders", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
app.include_router(orders.router)
