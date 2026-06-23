// Kafka producer (rust-rdkafka) — publishes doc lifecycle events.
use rdkafka::producer::{FutureProducer, FutureRecord};
use rdkafka::util::Timeout;

pub async fn publish_doc_indexed(doc_id: i64) -> anyhow::Result<()> {
    let producer = producer()?;
    producer
        .send(
            FutureRecord::to("doc-indexed")
                .payload(&doc_id.to_string())
                .key("doc"),
            Timeout::Never,
        )
        .await
        .map_err(|(e, _)| anyhow::anyhow!(e))?;
    Ok(())
}

pub async fn publish_doc_deleted(doc_id: i64) -> anyhow::Result<()> {
    let producer = producer()?;
    producer
        .send(
            FutureRecord::to("doc-deleted")
                .payload(&doc_id.to_string())
                .key("doc"),
            Timeout::Never,
        )
        .await
        .map_err(|(e, _)| anyhow::anyhow!(e))?;
    Ok(())
}

fn producer() -> anyhow::Result<FutureProducer> {
    use rdkafka::config::ClientConfig;
    Ok(ClientConfig::new()
        .set("bootstrap.servers", "localhost:9092")
        .create()?)
}
