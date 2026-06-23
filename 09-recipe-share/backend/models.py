"""SQLModel ORM models for recipes and users (Postgres)."""

from typing import Optional

from sqlmodel import Field, SQLModel, create_engine

engine = create_engine("postgresql://localhost/recipes")


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str


class Recipe(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    body: str
    image_url: str = ""
    author_id: int = Field(foreign_key="user.id")
    views: int = 0
