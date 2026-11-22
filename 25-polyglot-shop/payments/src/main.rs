mod error;
mod events;
mod models;
mod routes;

use std::env;

use axum::routing::{get, post};
use axum::Router;
use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;
use tower_http::cors::CorsLayer;

use crate::events::Publisher;

#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
    pub events: Publisher,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL is set");
    let brokers = env::var("KAFKA_BROKERS").unwrap_or_else(|_| "localhost:9092".to_string());
    let port = env::var("PORT").unwrap_or_else(|_| "8090".to_string());

    let db = PgPoolOptions::new()
        .max_connections(10)
        .connect(&database_url)
        .await
        .expect("connect to postgres");
    sqlx::migrate!().run(&db).await.expect("run migrations");
    let events = Publisher::new(&brokers).expect("create kafka producer");

    let app = Router::new()
        .route(
            "/api/payments",
            post(routes::create_payment).get(routes::list_payments),
        )
        .route("/api/payments/:id", get(routes::get_payment))
        .layer(CorsLayer::permissive())
        .with_state(AppState { db, events });

    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{port}"))
        .await
        .expect("bind");
    tracing::info!("payments listening on {port}");
    axum::serve(listener, app).await.expect("serve");
}
