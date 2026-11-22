use axum::{
    routing::{get, put},
    Router,
};
use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;

mod handlers;
mod models;

use handlers::{create_todo, delete_todo, get_user, list_todos, update_todo};

/// Shared application state handed to every handler.
#[derive(Clone)]
pub struct AppState {
    pub pool: PgPool,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt::init();

    let database_url =
        std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;

    let state = AppState { pool };

    let app = Router::new()
        .route("/api/todos", get(list_todos).post(create_todo))
        .route("/api/todos/:id", put(update_todo).delete(delete_todo))
        .route("/api/users/:id", get(get_user))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;
    tracing::info!("listening on {}", listener.local_addr()?);
    axum::serve(listener, app).await?;

    Ok(())
}
