// Actix-web HTTP handlers for the metrics dashboard.

use actix_web::{get, post, web, HttpResponse, Responder};
use serde::Deserialize;

use crate::cache;
use crate::queue;
use crate::repo;
use crate::state::AppState;

#[derive(Deserialize)]
struct NewDashboardBody {
    name: String,
    owner: String,
}

#[derive(Deserialize)]
struct MetricBody {
    name: String,
    value: f64,
}

#[get("/api/dashboards")]
async fn list_dashboards(state: web::Data<AppState>) -> impl Responder {
    let mut conn = state.pg();
    let rows = repo::list_dashboards(&mut conn);
    HttpResponse::Ok().json(rows)
}

#[get("/api/dashboards/{id}")]
async fn get_dashboard(state: web::Data<AppState>, path: web::Path<i64>) -> impl Responder {
    let id = path.into_inner();
    let mut conn = state.pg();
    let mut rc = state.redis();
    cache::bump_views(&mut rc);
    match repo::find_dashboard(&mut conn, id) {
        Some(row) => HttpResponse::Ok().json(row),
        None => HttpResponse::NotFound().finish(),
    }
}

#[post("/api/dashboards")]
async fn create_dashboard(
    state: web::Data<AppState>,
    body: web::Json<NewDashboardBody>,
) -> impl Responder {
    let mut conn = state.pg();
    repo::insert_dashboard(&mut conn, &body.name, &body.owner);
    queue::publish_dashboard_created(&state.channel, 1).await;
    HttpResponse::Created().json(())
}

#[post("/api/dashboards/{id}/metrics")]
async fn record_metric(
    state: web::Data<AppState>,
    path: web::Path<i64>,
    body: web::Json<MetricBody>,
) -> impl Responder {
    let id = path.into_inner();
    let mut conn = state.pg();
    let mut rc = state.redis();
    repo::insert_metric(&mut conn, id, &body.name, body.value);
    cache::cache_metric(&mut rc, id, body.value);
    HttpResponse::Accepted().finish()
}

#[post("/api/dashboards/{id}/export")]
async fn export_dashboard(state: web::Data<AppState>, path: web::Path<i64>) -> impl Responder {
    let id = path.into_inner();
    let snapshot = b"{}".to_vec();
    crate::storage::export_snapshot(&state.gcs, id, snapshot).await;
    HttpResponse::Ok().finish()
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(list_dashboards)
        .service(get_dashboard)
        .service(create_dashboard)
        .service(record_metric)
        .service(export_dashboard);
}
