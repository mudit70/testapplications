"""Google Cloud Storage layer for recipe images (gcs-py)."""

from google.cloud import storage

client = storage.Client()


def upload_image(name: str, data: str) -> str:
    """Upload a recipe image and return its gs:// path."""
    blob = client.bucket("recipe-images").blob(f"uploads/{name}")
    blob.upload_from_string(data)
    return f"gs://recipe-images/uploads/{name}"


def download_image(name: str):
    return client.bucket("recipe-images").blob(f"uploads/{name}").download_as_text()


def delete_image(name: str):
    return client.bucket("recipe-images").blob(f"uploads/{name}").delete()
