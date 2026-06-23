# 07-dev-forum

A developer Q&A forum (threads & posts).

| Tier | Stack |
|------|-------|
| Frontend | Remix (TS) + Zustand store + `fetch` |
| Backend | Fastify (TS) |
| Data | Drizzle ORM (Postgres) |
| Cache | memcache (`memjs`) |
| Queue | Kafka (`kafkajs`) |
| Search | Elasticsearch (`@elastic/elasticsearch`) |

Plugins exercised: `remix`, `state-mgmt`, `fastify`, `drizzle`, `memcache-ts`,
`kafkajs`, `elastic-ts` (+ `fetch`, `dom`).

Frontend `fetch()` URLs mirror the Fastify route patterns so cross-tier flows
stitch (e.g. `/api/threads` ↔ `GET /api/threads`). Route handlers call into
`threads.service.ts`, which performs the Drizzle queries, cache reads/writes,
Kafka event emits, and Elasticsearch index/search operations.

```
adorable analyze 07-dev-forum
```
