# 15-metrics-dash

Metrics dashboard service: list/get/create dashboards, record metrics (cached +
persisted), publish dashboard-created events, and export snapshots to object
storage.

| Tier | Stack |
|------|-------|
| Frontend | Svelte / SvelteKit (TS) + `fetch` |
| Backend | Actix-web (Rust) |
| Data | Diesel ORM (Postgres) |
| Cache | Redis (`redis-rs`) |
| Queue | RabbitMQ (`lapin`) |
| Storage | Google Cloud Storage (`google-cloud-storage`) |

Plugins exercised: `svelte`, `actix`, `diesel`, `redisrs`, `lapin`, `gcs-rs`
(+ `fetch`, `dom`).

```
adorable analyze 15-metrics-dash
```
