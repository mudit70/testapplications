from collections.abc import Generator
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, create_engine

from app.core.config import settings
from app.models import User

engine = create_engine(settings.DATABASE_URL)
reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="/api/login")


def get_db() -> Generator[Session]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(reusable_oauth2)]


def get_current_user(session: SessionDep, token: TokenDep) -> User:
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    user = session.get(User, payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# An alias: a parameter annotated CurrentUser depends on get_current_user.
CurrentUser = Annotated[User, Depends(get_current_user)]


def get_current_active_superuser(current_user: CurrentUser) -> User:
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough privileges")
    return current_user
