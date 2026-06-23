# 17-search-svc

Document search service (Rust workspace, two backend crates).

| Tier | Stack |
|------|-------|
| Frontend | Vue (TS) + `fetch` |
| API service | Rocket (Rust) |
| API data | sqlx (Postgres) |
| API events | Kafka (`rdkafka`) |
| API search | Elasticsearch (Rust client) |
| Indexer service | Poem (Rust) |
| Indexer store | MongoDB (Rust driver) |
| Indexer RPC | tonic (gRPC) |

The frontend's `fetch()` URL literals (`/api/search`, `/api/docs/:id`,
`/api/docs`, `/indexer/rebuild`, `/indexer/status`) mirror the Rocket and
Poem route patterns. `services/api` searches documents (Elasticsearch),
persists them (sqlx/Postgres) and emits Kafka events on index. `services/indexer`
exposes Poem control endpoints that (re)build the index from MongoDB and a
tonic gRPC service reporting index status.

Plugins exercised: `vue`, `rocket`, `poem`, `sqlx`, `kafkars`, `elastic-rs`,
`mongorust`, `tonic` (+ `fetch`, `dom`).

```
adorable analyze 17-search-svc
```
