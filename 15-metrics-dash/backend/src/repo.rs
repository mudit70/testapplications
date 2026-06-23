// Diesel data access for dashboards and metrics (Postgres).

use diesel::prelude::*;

use crate::schema::{dashboards, metrics};

#[derive(Insertable)]
#[diesel(table_name = dashboards)]
struct NewDashboard<'a> {
    name: &'a str,
    owner: &'a str,
}

#[derive(Insertable)]
#[diesel(table_name = metrics)]
struct NewMetric<'a> {
    dashboard_id: i64,
    name: &'a str,
    value: f64,
}

pub fn list_dashboards(conn: &mut PgConnection) -> Vec<(i64, String, String)> {
    dashboards::table
        .select((dashboards::id, dashboards::name, dashboards::owner))
        .load(conn)
        .unwrap()
}

pub fn find_dashboard(conn: &mut PgConnection, id: i64) -> Option<(i64, String, String)> {
    dashboards::table.find(id).first(conn).ok()
}

pub fn insert_dashboard(conn: &mut PgConnection, name: &str, owner: &str) {
    diesel::insert_into(dashboards::table)
        .values(&NewDashboard { name, owner })
        .execute(conn)
        .unwrap();
}

pub fn insert_metric(conn: &mut PgConnection, dashboard_id: i64, name: &str, value: f64) {
    diesel::insert_into(metrics::table)
        .values(&NewMetric {
            dashboard_id,
            name,
            value,
        })
        .execute(conn)
        .unwrap();
}

pub fn rename_dashboard(conn: &mut PgConnection, id: i64, name: &str) {
    diesel::update(dashboards::table.find(id))
        .set(dashboards::name.eq(name))
        .execute(conn)
        .unwrap();
}

pub fn delete_dashboard(conn: &mut PgConnection, id: i64) {
    diesel::delete(dashboards::table.find(id))
        .execute(conn)
        .unwrap();
}
