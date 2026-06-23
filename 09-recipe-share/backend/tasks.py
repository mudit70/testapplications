"""Celery background tasks for recipe processing."""

from celery import Celery, shared_task

app = Celery("recipes", broker="redis://localhost:6379/0")


@app.task
def index_recipe(recipe_id: int):
    """Re-index a recipe for search after creation."""
    return {"indexed": recipe_id}


@shared_task(name="recipes.thumbnail")
def generate_thumbnail(image_url: str):
    """Produce a thumbnail for the uploaded image."""
    return {"thumbnail": image_url}


def enqueue_index(recipe_id: int):
    index_recipe.delay(recipe_id)


def enqueue_thumbnail(image_url: str):
    generate_thumbnail.apply_async(args=[image_url])
