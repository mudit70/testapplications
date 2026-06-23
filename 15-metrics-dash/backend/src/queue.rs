// RabbitMQ publish/consume for dashboard events (lapin).

use lapin::{options::*, BasicProperties, Channel};

pub async fn publish_dashboard_created(channel: &Channel, id: i64) {
    let payload = format!("{{\"dashboard_id\":{}}}", id);
    channel
        .basic_publish(
            "dashboards",
            "dashboard.created",
            BasicPublishOptions::default(),
            payload.as_bytes(),
            BasicProperties::default(),
        )
        .await
        .unwrap();
}

pub async fn consume_dashboard_events(channel: &Channel) {
    channel
        .basic_consume(
            "dashboard-events",
            "metrics-consumer",
            BasicConsumeOptions::default(),
            Default::default(),
        )
        .await
        .unwrap();
}
