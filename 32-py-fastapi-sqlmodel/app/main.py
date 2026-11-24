from fastapi import APIRouter, FastAPI

from app.api.routes import items, users

app = FastAPI(title="py-fastapi-sqlmodel")

api_router = APIRouter()
api_router.include_router(users.router)
api_router.include_router(items.router)
app.include_router(api_router, prefix="/api")
