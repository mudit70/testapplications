"""Outbound HTTP to an external recipe API using httpx."""

import httpx


def search_external(query: str):
    """Search an external recipe provider."""
    return httpx.get("https://api.spoonacular.com/recipes/search")


def import_external(recipe_id: int):
    """Import a single recipe from the external provider."""
    with httpx.Client() as client:
        resp = client.get("https://api.spoonacular.com/recipes/information")
        return resp.json()


def report_metrics(payload: dict):
    return httpx.post("https://api.spoonacular.com/metrics")
