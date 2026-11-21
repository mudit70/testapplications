use axum::extract::{Path, Query, State};
use axum::http::StatusCode;
use axum::Json;

use crate::error::AppError;
use crate::models::{NewPayment, Payment, PaymentsQuery};
use crate::AppState;

/// Records the payment as settled and announces it on payment.settled.
pub async fn create_payment(
    State(state): State<AppState>,
    Json(body): Json<NewPayment>,
) -> Result<(StatusCode, Json<Payment>), AppError> {
    if body.amount_cents <= 0 {
        return Err(AppError::BadRequest("amount_cents must be positive"));
    }
    let row = sqlx::query!(
        "INSERT INTO payments (order_id, amount_cents, status) VALUES ($1, $2, 'settled') \
         RETURNING id, created_at",
        body.order_id,
        body.amount_cents,
    )
    .fetch_one(&state.db)
    .await?;

    let payment = Payment {
        id: row.id,
        order_id: body.order_id,
        amount_cents: body.amount_cents,
        status: "settled".to_string(),
        created_at: row.created_at,
    };
    state.events.payment_settled(&payment).await?;
    Ok((StatusCode::CREATED, Json(payment)))
}

pub async fn list_payments(
    State(state): State<AppState>,
    Query(q): Query<PaymentsQuery>,
) -> Result<Json<Vec<Payment>>, AppError> {
    let payments = sqlx::query_as::<_, Payment>(
        "SELECT id, order_id, amount_cents, status, created_at FROM payments \
         WHERE order_id = $1 ORDER BY created_at",
    )
    .bind(q.order_id)
    .fetch_all(&state.db)
    .await?;
    Ok(Json(payments))
}

pub async fn get_payment(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Payment>, AppError> {
    let payment = sqlx::query_as!(
        Payment,
        "SELECT id, order_id, amount_cents, status, created_at FROM payments WHERE id = $1",
        id,
    )
    .fetch_optional(&state.db)
    .await?
    .ok_or(AppError::NotFound)?;
    Ok(Json(payment))
}
