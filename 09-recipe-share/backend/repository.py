"""Database access layer using SQLModel sessions."""

from sqlmodel import Session, select

from models import Recipe, User, engine


def list_recipes():
    with Session(engine) as session:
        return session.exec(select(Recipe)).all()


def get_recipe(recipe_id: int):
    with Session(engine) as session:
        return session.get(Recipe, recipe_id)


def popular_recipes():
    with Session(engine) as session:
        return session.exec(select(Recipe).where(Recipe.views > 100)).all()


def add_recipe(title: str, body: str, author_id: int, image_url: str):
    with Session(engine) as session:
        recipe = Recipe(
            title=title, body=body, author_id=author_id, image_url=image_url
        )
        session.add(recipe)
        session.commit()
        session.refresh(recipe)
        return recipe


def list_users():
    with Session(engine) as session:
        return session.exec(select(User)).all()
