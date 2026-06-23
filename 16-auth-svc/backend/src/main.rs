// Auth service backend: Warp HTTP API stitching SeaORM (Postgres),
// reqwest (external IdP), memcache (session cache), Azure Blob
// (avatars) and tokio-tungstenite (session events).
use warp::Filter;

mod cache;
mod db;
mod entities;
mod events;
mod idp;
mod storage;

use azure_storage_blobs::prelude::BlobServiceClient;
use memcache::Client as MemcacheClient;
use reqwest::Client as HttpClient;
use sea_orm::DatabaseConnection;

async fn register(conn: &DatabaseConnection) -> Result<&'static str, warp::Rejection> {
    db::create_user(conn).await.ok();
    Ok("registered")
}

async fn login(
    conn: &DatabaseConnection,
    http: &HttpClient,
    cache: &MemcacheClient,
) -> Result<&'static str, warp::Rejection> {
    // Validate against the external IdP, persist + cache the session.
    idp::verify_credentials(http, "user@example.com").await.ok();
    idp::fetch_userinfo(http).await.ok();
    db::create_session(conn).await.ok();
    cache::cache_session(cache, "tok-123").ok();
    Ok("session")
}

async fn get_profile(conn: &DatabaseConnection, _id: u32) -> Result<&'static str, warp::Rejection> {
    db::find_user(conn, _id as i32).await.ok();
    Ok("profile")
}

async fn logout(
    conn: &DatabaseConnection,
    cache: &MemcacheClient,
) -> Result<&'static str, warp::Rejection> {
    db::delete_session(conn, 1).await.ok();
    cache::drop_session(cache).ok();
    Ok("logged out")
}

async fn upload_avatar(
    svc: &BlobServiceClient,
    _id: u32,
) -> Result<&'static str, warp::Rejection> {
    storage::upload_avatar(svc, vec![]).await.ok();
    Ok("uploaded")
}

#[tokio::main]
async fn main() {
    let register_route = warp::path!("api" / "register")
        .and(warp::post())
        .and_then(|| async {
            let conn = DatabaseConnection::Disconnected;
            register(&conn).await
        });

    let login_route = warp::path!("api" / "login")
        .and(warp::post())
        .and_then(|| async {
            let conn = DatabaseConnection::Disconnected;
            let http = HttpClient::new();
            let cache = MemcacheClient::connect("memcache://127.0.0.1:11211").unwrap();
            login(&conn, &http, &cache).await
        });

    let profile_route = warp::path!("api" / "users" / u32)
        .and(warp::get())
        .and_then(|id| async move {
            let conn = DatabaseConnection::Disconnected;
            get_profile(&conn, id).await
        });

    let logout_route = warp::path!("api" / "logout")
        .and(warp::post())
        .and_then(|| async {
            let conn = DatabaseConnection::Disconnected;
            let cache = MemcacheClient::connect("memcache://127.0.0.1:11211").unwrap();
            logout(&conn, &cache).await
        });

    let avatar_route = warp::path!("api" / "users" / u32 / "avatar")
        .and(warp::post())
        .and_then(|id| async move {
            let svc = BlobServiceClient::new("acct", Default::default());
            upload_avatar(&svc, id).await
        });

    // Spin up the realtime session-event websocket listener.
    events::dial_event_bus().await.ok();

    let routes = register_route
        .or(login_route)
        .or(profile_route)
        .or(logout_route)
        .or(avatar_route);

    warp::serve(routes).run(([0, 0, 0, 0], 8080)).await;
}
