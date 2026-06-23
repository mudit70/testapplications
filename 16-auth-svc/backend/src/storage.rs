// Avatar storage backed by Azure Blob Storage (azure_storage_blobs crate).
use azure_storage_blobs::prelude::*;

pub async fn upload_avatar(svc: &BlobServiceClient, data: Vec<u8>) -> azure_core::Result<()> {
    // PUT → azure://avatars/user.png
    let _ = svc
        .container_client("avatars")
        .blob_client("user.png")
        .put_block_blob(data)
        .await?;
    Ok(())
}

pub async fn fetch_avatar(svc: &BlobServiceClient) -> azure_core::Result<()> {
    // GET → azure://avatars/user.png
    let _ = svc
        .container_client("avatars")
        .blob_client("user.png")
        .get()
        .await?;
    Ok(())
}
