from fastapi import APIRouter, Depends, HTTPException

from app import crud
from app.api.deps import CurrentUser, SessionDep, get_current_active_superuser
from app.models import User, UserCreate, UserUpdateMe
from app.utils import send_email

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", dependencies=[Depends(get_current_active_superuser)])
def create_user(*, session: SessionDep, user_in: UserCreate) -> User:
    if crud.get_user_by_email(session=session, email=user_in.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    user = crud.create_user(session=session, user_create=user_in)
    send_email(email_to=user_in.email, subject="Welcome", html_content="<p>Welcome</p>")
    return user


@router.patch("/me")
def update_user_me(*, session: SessionDep, user_in: UserUpdateMe, current_user: CurrentUser) -> User:
    current_user.sqlmodel_update(user_in.model_dump(exclude_unset=True))
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user


@router.delete("/me")
def delete_user_me(session: SessionDep, current_user: CurrentUser) -> dict:
    session.delete(current_user)
    session.commit()
    return {"message": "User deleted"}
