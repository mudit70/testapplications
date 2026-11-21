use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, sqlx::FromRow)]
pub struct Payment {
    pub id: i64,
    pub order_id: i64,
    pub amount_cents: i64,
    pub status: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct NewPayment {
    pub order_id: i64,
    pub amount_cents: i64,
}

#[derive(Debug, Deserialize)]
pub struct PaymentsQuery {
    pub order_id: i64,
}
