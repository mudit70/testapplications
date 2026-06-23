// Shared application state: Postgres, Redis, RabbitMQ, GCS handles.

use diesel::pg::PgConnection;
use diesel::Connection;
use google_cloud_storage::client::Client;
use lapin::Channel;

pub struct AppState {
    pub database_url: String,
    pub redis_url: String,
    pub channel: Channel,
    pub gcs: Client,
}

impl AppState {
    pub fn pg(&self) -> PgConnection {
        PgConnection::establish(&self.database_url).unwrap()
    }

    pub fn redis(&self) -> redis::Connection {
        let client = redis::Client::open(self.redis_url.as_str()).unwrap();
        client.get_connection().unwrap()
    }
}
