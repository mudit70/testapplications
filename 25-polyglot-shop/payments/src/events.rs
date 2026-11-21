use std::time::Duration;

use rdkafka::config::ClientConfig;
use rdkafka::error::KafkaError;
use rdkafka::producer::{FutureProducer, FutureRecord};
use serde::Serialize;

use crate::models::Payment;

pub const PAYMENT_SETTLED: &str = "payment.settled";

#[derive(Serialize)]
struct PaymentSettled {
    payment_id: i64,
    order_id: i64,
    amount_cents: i64,
}

#[derive(Clone)]
pub struct Publisher {
    producer: FutureProducer,
}

impl Publisher {
    pub fn new(brokers: &str) -> Result<Self, KafkaError> {
        let producer: FutureProducer = ClientConfig::new()
            .set("bootstrap.servers", brokers)
            .set("message.timeout.ms", "5000")
            .create()?;
        Ok(Self { producer })
    }

    /// Tells orders the payment went through; orders marks the order paid.
    pub async fn payment_settled(&self, payment: &Payment) -> Result<(), KafkaError> {
        let payload = serde_json::to_string(&PaymentSettled {
            payment_id: payment.id,
            order_id: payment.order_id,
            amount_cents: payment.amount_cents,
        })
        .expect("a PaymentSettled always serializes");
        let key = payment.order_id.to_string();
        self.producer
            .send(
                FutureRecord::to(PAYMENT_SETTLED).key(&key).payload(&payload),
                Duration::from_secs(5),
            )
            .await
            .map_err(|(e, _)| e)?;
        Ok(())
    }
}
