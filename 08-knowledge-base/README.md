# 08-knowledge-base

Team knowledge base / wiki — a TypeScript monorepo with three backend services.

| Tier | Stack |
|------|-------|
| Frontend | React Router (`react-router-dom` v6 data router) + `fetch` |
| Service: articles | Koa + `koa-router` |
| Service: search | Hono |
| Service: gateway | Hapi (`@hapi/hapi`) |
| Data (articles) | Sequelize (Postgres) |
| Data (search) | MikroORM (`@mikro-orm/core`) |
| Data (gateway) | Knex (Postgres) + Mongoose (MongoDB) |
| Queue | `amqplib` (RabbitMQ) |
| Storage | Azure Blob Storage (`@azure/storage-blob`) + Google Cloud Storage (`@google-cloud/storage`) |
| Edge / BaaS | Supabase (`@supabase/supabase-js`) |
| RPC | gRPC (`@grpc/grpc-js`) + GraphQL (`graphql`) + tRPC (`@trpc/server`) |

Plugins exercised: `react-router`, `koa`, `hono`, `hapi`, `sequelize`,
`mikroorm`, `knex`, `mongoose`, `amqplib`, `azure-blob-ts`, `gcs-ts`,
`supabase`, `grpc-node`, `graphql`, `trpc` (+ `fetch`, `dom`).

## Layout

```
frontend/              React Router SPA, fetch() client
services/articles/     Koa + Sequelize + amqplib + Azure Blob
services/search/       Hono + MikroORM + GCS + Supabase
services/gateway/      Hapi + Knex + Mongoose + gRPC + GraphQL + tRPC
```

```
adorable analyze 08-knowledge-base
```
