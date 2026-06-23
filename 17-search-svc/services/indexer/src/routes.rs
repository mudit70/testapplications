// Poem #[handler] endpoints for the indexer control plane.
use poem::{handler, web::Json, web::Path};
use serde::Serialize;

use crate::store;

#[derive(Serialize)]
pub struct StatusReply {
    pub docs: u64,
    pub status: String,
}

#[derive(Serialize)]
pub struct DocStatus {
    pub id: String,
    pub indexed: bool,
}

#[handler]
pub async fn rebuild() -> Json<StatusReply> {
    let docs = store::reindex_all().await.unwrap_or(0);
    Json(StatusReply { docs, status: "rebuilt".into() })
}

#[handler]
pub async fn status() -> Json<StatusReply> {
    let docs = store::count_docs().await.unwrap_or(0);
    Json(StatusReply { docs, status: "ready".into() })
}

#[handler]
pub async fn doc_status(Path(id): Path<String>) -> Json<DocStatus> {
    let found = store::find_doc(&id).await.unwrap_or(false);
    Json(DocStatus { id, indexed: found })
}
