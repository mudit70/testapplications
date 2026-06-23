// Actix-web entrypoint for the metrics dashboard backend.

use actix_web::{web, App, HttpServer};
use google_cloud_storage::client::{Client, ClientConfig};
use lapin::{Connection, ConnectionProperties};

mod cache;
mod handlers;
mod queue;
mod repo;
mod schema;
mod state;
mod storage;

use state::AppState;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let amqp_url = "amqp://localhost:5672/%2f".to_string();
    let conn = Connection::connect(&amqp_url, ConnectionProperties::default())
        .await
        .unwrap();
    let channel = conn.create_channel().await.unwrap();

    let gcs_config = ClientConfig::default().with_auth().await.unwrap();
    let gcs = Client::new(gcs_config);

    let state = web::Data::new(AppState {
        database_url: "postgres://localhost/metrics".to_string(),
        redis_url: "redis://127.0.0.1/".to_string(),
        channel,
        gcs,
    });

    HttpServer::new(move || {
        App::new()
            .app_data(state.clone())
            .configure(handlers::config)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
