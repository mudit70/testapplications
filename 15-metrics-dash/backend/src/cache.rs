// Redis cache for metric counters (redis-rs).

use redis::Commands;

pub fn cache_metric(conn: &mut redis::Connection, dashboard_id: i64, value: f64) {
    let key = format!("dashboard:{}:latest", dashboard_id);
    let _: () = conn.set(key, value).unwrap();
}

pub fn read_metric(conn: &mut redis::Connection, dashboard_id: i64) -> Option<f64> {
    let key = format!("dashboard:{}:latest", dashboard_id);
    conn.get(key).ok()
}

pub fn bump_views(conn: &mut redis::Connection) {
    let _: () = conn.incr("dashboard:views", 1).unwrap();
}
