// mongodb (Rust driver) — source of truth documents to (re)index.
use mongodb::{Client, Database};
use mongodb::bson::doc;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct DocRecord {
    pub id: String,
    pub title: String,
    pub body: String,
}

pub async fn reindex_all() -> anyhow::Result<u64> {
    let db = database().await?;
    let docs = db.collection::<DocRecord>("documents");
    let _cursor = docs.find(doc! {}, None).await?;
    let total = docs.count_documents(doc! {}, None).await?;
    Ok(total)
}

pub async fn count_docs() -> anyhow::Result<u64> {
    let db = database().await?;
    let docs = db.collection::<DocRecord>("documents");
    let total = docs.count_documents(doc! {}, None).await?;
    Ok(total)
}

pub async fn find_doc(id: &str) -> anyhow::Result<bool> {
    let db = database().await?;
    let docs = db.collection::<DocRecord>("documents");
    let found = docs.find_one(doc! { "_id": id }, None).await?;
    Ok(found.is_some())
}

pub async fn mark_indexed(id: &str) -> anyhow::Result<()> {
    let db = database().await?;
    let docs = db.collection::<DocRecord>("documents");
    docs.update_one(
        doc! { "_id": id },
        doc! { "$set": { "indexed": true } },
        None,
    )
    .await?;
    Ok(())
}

pub async fn upsert_doc(rec: DocRecord) -> anyhow::Result<()> {
    let db = database().await?;
    let docs = db.collection::<DocRecord>("documents");
    docs.insert_one(rec, None).await?;
    Ok(())
}

async fn database() -> anyhow::Result<Database> {
    let uri = std::env::var("MONGO_URI").unwrap_or_else(|_| "mongodb://localhost:27017".into());
    let client = Client::with_uri_str(&uri).await?;
    Ok(client.database("search"))
}
