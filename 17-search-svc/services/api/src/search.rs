// Elasticsearch (Rust client) — index and query documents.
use elasticsearch::{Elasticsearch, IndexParts, SearchParts};
use serde_json::json;

use crate::routes::{Document, SearchHit};

pub async fn index_document(doc: &Document) -> anyhow::Result<()> {
    let client = client()?;
    client
        .index(IndexParts::Index("documents"))
        .body(json!({
            "id": doc.id,
            "title": doc.title,
            "body": doc.body,
        }))
        .send()
        .await?;
    Ok(())
}

pub async fn query_index(q: &str) -> anyhow::Result<Vec<SearchHit>> {
    let client = client()?;
    let resp = client
        .search(SearchParts::Index(&["documents"]))
        .body(json!({
            "query": { "multi_match": { "query": q, "fields": ["title", "body"] } }
        }))
        .send()
        .await?;
    let _body = resp.json::<serde_json::Value>().await?;
    Ok(vec![])
}

fn client() -> anyhow::Result<Elasticsearch> {
    Ok(Elasticsearch::default())
}
