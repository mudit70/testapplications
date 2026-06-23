# 14-alerting

Incident alerting service: list/create/ack alerts, attach evidence blobs, and
fetch alert stats over gRPC.

| Tier | Stack |
|------|-------|
| Frontend | Svelte / SvelteKit (TS) + `fetch` |
| Backend | Chi (Go) |
| Data | sqlx (Postgres) |
| Queue | RabbitMQ (`rabbitmq/amqp091-go`) |
| Storage | Azure Blob Storage (`azure-sdk-for-go` azblob) |
| RPC | gRPC (`google.golang.org/grpc`) |

Plugins exercised: `svelte`, `chi`, `gosqlx`, `amqp091-go`, `azure-blob-go`,
`grpcgo` (+ `fetch`, `dom`).

```
adorable analyze 14-alerting
```
