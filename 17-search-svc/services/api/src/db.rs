// sqlx (Postgres) data access for documents.
use sqlx::PgPool;

use crate::routes::Document;

pub async fn fetch_doc(id: i64) -> anyhow::Result<Document> {
    let pool = pool().await?;
    let row = sqlx::query!("SELECT id, title, body FROM documents WHERE id = $1", id)
        .fetch_one(&pool)
        .await?;
    Ok(Document { id: row.id, title: row.title, body: row.body })
}

pub async fn list_docs() -> anyhow::Result<Vec<Document>> {
    let pool = pool().await?;
    let rows = sqlx::query!("SELECT id, title, body FROM documents")
        .fetch_all(&pool)
        .await?;
    Ok(rows
        .into_iter()
        .map(|r| Document { id: r.id, title: r.title, body: r.body })
        .collect())
}

pub async fn insert_doc(title: &str, body: &str) -> anyhow::Result<Document> {
    let pool = pool().await?;
    let row = sqlx::query!(
        "INSERT INTO documents (title, body) VALUES ($1, $2) RETURNING id",
        title,
        body
    )
    .fetch_one(&pool)
    .await?;
    Ok(Document { id: row.id, title: title.to_string(), body: body.to_string() })
}

pub async fn touch_indexed(id: i64) -> anyhow::Result<()> {
    let pool = pool().await?;
    sqlx::query("UPDATE documents SET indexed_at = NOW() WHERE id = $1")
        .bind(id)
        .execute(&pool)
        .await?;
    Ok(())
}

async fn pool() -> anyhow::Result<PgPool> {
    let url = std::env::var("DATABASE_URL")?;
    Ok(PgPool::connect(&url).await?)
}
