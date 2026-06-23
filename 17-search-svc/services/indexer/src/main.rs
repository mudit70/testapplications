mod routes;
mod store;
mod grpc;

use poem::{get, post, listener::TcpListener, Route, Server};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Poem HTTP control plane for the indexer. Route patterns mirror
    // the frontend's fetch() calls to "/indexer/*".
    let app = Route::new()
        .at("/indexer/rebuild", post(routes::rebuild))
        .at("/indexer/status", get(routes::status))
        .at("/indexer/docs/:id", get(routes::doc_status));

    // gRPC index-status service runs alongside (see grpc.rs).
    grpc::serve().await?;

    Server::new(TcpListener::bind("0.0.0.0:8081"))
        .run(app)
        .await?;
    Ok(())
}
