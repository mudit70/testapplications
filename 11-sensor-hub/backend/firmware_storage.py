"""Firmware image storage backed by Azure Blob Storage."""

from azure.storage.blob import BlobServiceClient

svc = BlobServiceClient.from_connection_string("UseDevelopmentStorage=true")


def upload_firmware(version: str, data: bytes):
    # PUT → azure://firmware/images/<version>.bin
    return svc.get_container_client("firmware").get_blob_client(f"images/{version}.bin").upload_blob(data)


def download_firmware():
    # GET → azure://firmware/images/latest.bin
    return svc.get_container_client("firmware").get_blob_client("images/latest.bin").download_blob()


def delete_firmware():
    # DELETE → azure://firmware/images/legacy.bin
    return svc.get_container_client("firmware").get_blob_client("images/legacy.bin").delete_blob()


def list_firmware():
    # GET → azure://firmware/ (container scope)
    return svc.get_container_client("firmware").list_blobs()
