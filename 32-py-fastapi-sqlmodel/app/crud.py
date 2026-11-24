from sqlmodel import Session, select

from app.models import User, UserCreate


def create_user(*, session: Session, user_create: UserCreate) -> User:
    db_obj = User.model_validate(user_create, update={"hashed_password": "hashed:" + user_create.password})
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def get_user_by_email(*, session: Session, email: str) -> User | None:
    return session.exec(select(User).where(User.email == email)).first()
