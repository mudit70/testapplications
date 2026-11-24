import uuid

from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    is_superuser: bool = False


class UserCreate(UserBase):
    password: str


class UserUpdateMe(SQLModel):
    email: str | None = None


class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str


class ItemCreate(SQLModel):
    title: str


class Item(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str
    owner_id: uuid.UUID = Field(foreign_key="user.id")
