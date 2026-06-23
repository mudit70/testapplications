"""Flask HTTP API for the recipe sharing app."""

import json

from flask import Flask, request

import cache
import external
import repository
import storage
import tasks

app = Flask(__name__)


@app.route("/api/recipes")
def list_recipes():
    recipes = repository.list_recipes()
    return {"recipes": [r.dict() for r in recipes]}


@app.route("/api/recipes/<int:recipe_id>")
def get_recipe(recipe_id):
    cached = cache.get_cached_recipe(recipe_id)
    if cached:
        return json.loads(cached)
    recipe = repository.get_recipe(recipe_id)
    cache.set_cached_recipe(recipe_id, json.dumps(recipe.dict()))
    cache.bump_views(recipe_id)
    return recipe.dict()


@app.route("/api/recipes/popular")
def popular_recipes():
    cached = cache.get_popular()
    if cached:
        return json.loads(cached)
    recipes = repository.popular_recipes()
    payload = {"recipes": [r.dict() for r in recipes]}
    cache.set_popular(json.dumps(payload))
    return payload


@app.route("/api/recipes", methods=["POST"])
def create_recipe():
    body = request.get_json()
    image_url = storage.upload_image(body["image_name"], body["image_data"])
    recipe = repository.add_recipe(
        body["title"], body["body"], body["author_id"], image_url
    )
    tasks.enqueue_index(recipe.id)
    tasks.enqueue_thumbnail(image_url)
    cache.invalidate_recipe(recipe.id)
    return recipe.dict()


@app.route("/api/recipes/search")
def search_recipes():
    query = request.args.get("q", "")
    resp = external.search_external(query)
    return {"results": resp.json()}


@app.route("/api/recipes/import", methods=["POST"])
def import_recipe():
    body = request.get_json()
    data = external.import_external(body["external_id"])
    return {"imported": data}


@app.route("/api/users")
def list_users():
    users = repository.list_users()
    return {"users": [u.dict() for u in users]}


if __name__ == "__main__":
    app.run(port=8000)
