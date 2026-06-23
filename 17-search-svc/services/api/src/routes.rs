// Rocket route handlers. Attribute macros + the `routes![]` in main.rs
// mounted at "/api" compose into:
//   GET  /api/search?<q>
//   GET  /api/docs/<id>
//   POST /api/docs
use rocket::serde::json::Json;
use serde::{Deserialize, Serialize};

use crate::db;
use crate::events;
use crate::search;

#[derive(Serialize)]
pub struct SearchHit {
    pub id: i64,
    pub title: String,
    pub score: f64,
}

#[derive(Serialize)]
pub struct SearchResponse {
    pub hits: Vec<SearchHit>,
}

#[derive(Serialize)]
pub struct Document {
    pub id: i64,
    pub title: String,
    pub body: String,
}

#[derive(Deserialize)]
pub struct NewDocument {
    pub title: String,
    pub body: String,
}

#[get("/search?<q>")]
pub async fn search_docs(q: String) -> Json<SearchResponse> {
    let hits = search::query_index(&q).await.unwrap_or_default();
    Json(SearchResponse { hits })
}

#[get("/docs/<id>")]
pub async fn get_doc(id: i64) -> Json<Document> {
    let doc = db::fetch_doc(id).await.unwrap();
    Json(doc)
}

#[post("/docs", data = "<input>")]
pub async fn index_doc(input: Json<NewDocument>) -> Json<Document> {
    let doc = db::insert_doc(&input.title, &input.body).await.unwrap();
    search::index_document(&doc).await.unwrap();
    events::publish_doc_indexed(doc.id).await.unwrap();
    Json(doc)
}
