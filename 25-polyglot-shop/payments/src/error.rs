use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde_json::json;

#[derive(Debug)]
pub enum AppError {
    BadRequest(&'static str),
    NotFound,
    Database(sqlx::Error),
    Kafka(rdkafka::error::KafkaError),
}

impl From<sqlx::Error> for AppError {
    fn from(e: sqlx::Error) -> Self {
        AppError::Database(e)
    }
}

impl From<rdkafka::error::KafkaError> for AppError {
    fn from(e: rdkafka::error::KafkaError) -> Self {
        AppError::Kafka(e)
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            AppError::BadRequest(m) => (StatusCode::BAD_REQUEST, m.to_string()),
            AppError::NotFound => (StatusCode::NOT_FOUND, "payment not found".to_string()),
            AppError::Database(e) => {
                tracing::error!(error = %e, "database");
                (StatusCode::INTERNAL_SERVER_ERROR, "internal error".to_string())
            }
            AppError::Kafka(e) => {
                tracing::error!(error = %e, "kafka");
                (StatusCode::BAD_GATEWAY, "could not announce the payment".to_string())
            }
        };
        (status, Json(json!({ "error": message }))).into_response()
    }
}
