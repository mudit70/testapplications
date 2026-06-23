"""Memcache layer for caching popular recipe reads (pymemcache)."""

from pymemcache.client.base import Client

client = Client(("localhost", 11211))


def get_cached_recipe(recipe_id: int):
    return client.get(f"recipe:{recipe_id}")


def set_cached_recipe(recipe_id: int, value: str):
    return client.set(f"recipe:{recipe_id}", value)


def get_popular():
    return client.get("recipes:popular")


def set_popular(value: str):
    return client.set("recipes:popular", value)


def bump_views(recipe_id: int):
    return client.incr(f"recipe:views:{recipe_id}", 1)


def invalidate_recipe(recipe_id: int):
    return client.delete(f"recipe:{recipe_id}")
