# testapplications

Polyglot sample applications for exercising the **adorable** analyzer's
framework plugins across realistic frontend / backend / data-tier
combinations. The repository will continue to grow as we find patterns
not yet covered by the analyzer.

Each app is self-contained. Run adorable on each one:

```
adorable analyze 06-collab-board
```

Or run the bundled harness against all of them (requires the sibling
`adorable` repo built — `pnpm --filter @adorable/cli build`):

```
node verify.mjs                 # all apps
node verify.mjs 06-collab-board # one app
```

## Apps

Each app is built so a specific set of plugins is detected. Together
with the 5 in-tree apps in `adorable/test-apps`, these exercise **all
112** of adorable's framework plugins.

| App | Frontend | Backend | Data / infra plugins |
|-----|----------|---------|----------------------|
| 06-collab-board | Angular | Express (TS) | TypeORM, BullMQ, aws-s3-ts, ws-ts, redirects |
| 07-dev-forum | Remix + state-mgmt | Fastify (TS) | Drizzle, memcache-ts, kafkajs, elastic-ts |
| 08-knowledge-base | React Router | Koa + Hono + Hapi (TS) | Sequelize, MikroORM, Knex, mongoose, amqplib, azure-blob-ts, gcs-ts, supabase, grpc-node, graphql, trpc |
| 09-recipe-share | React | Flask (Py) | SQLModel, memcache-py, celery, gcs-py, httpx |
| 10-live-polls | Vue | aiohttp (Py) | Tortoise, ws-py, pika, elastic-py |
| 11-sensor-hub | React Native | Tornado (Py) | Peewee, pymongo, kafkapy, azure-blob-py, grpcio |
| 12-ride-share | Vue | Echo (Go) | GORM, goredis, asynq, awsgo-s3, ws-go |
| 13-warehouse | React | Fiber (Go) | Ent, kafkago, elastic-go, gcs-go, memcache-go |
| 14-alerting | Svelte | Chi (Go) | gosqlx, amqp091-go, azure-blob-go, grpcgo |
| 15-metrics-dash | Svelte | Actix (Rust) | Diesel, redisrs, lapin, gcs-rs |
| 16-auth-svc | React | Warp (Rust) | SeaORM, reqwest, memcache-rs, azure-blob-rs, ws-rs |
| 17-search-svc | Vue | Rocket + Poem (Rust) | sqlx, kafkars, elastic-rs, mongorust, tonic |
| 18-banking | React | Spring (Java) | JPA |
| 19-blog | Vue | Laravel (PHP) | Eloquent |
| 20-devtools | — | Rust CLI + MCP server (TS) | rustcli, mcp-server |

### Phase 2 — deep apps (complexity probes)

Larger, deliberately-structured apps that implement the same feature across
a matrix of dispatch patterns to measure where the analyzer's end-to-end
**flow stitching** succeeds vs degrades.

| App | Stack | Endpoints | Complete flows |
|-----|-------|-----------|----------------|
| 21-deepshop-ts | React + Express + Prisma | 21 | 13 |
| 22-deepdesk-py | React + FastAPI + SQLAlchemy | 22 | 9 |
| 23-deepfleet-go | React + Gin + GORM | 27 | 0 |

`node flowreport.mjs <app>` prints the per-flow `completeness` breakdown.

## Status

Phase 1 apps (06–20) are **minimal but idiomatic** — the smallest code that
triggers each plugin and produces realistic cross-tier graph shapes. Together
with `adorable/test-apps` 01–05 they exercise **all 112** framework plugins.

Phase 2 apps (21–23) are **deep complexity probes**. They reproduce the first
non-zero complete-flow counts in the suite and map the analyzer's flow-walker
ceiling per stack.

- `COVERAGE.md` — full per-app detection report (Phase 1) + analyzer quirks.
- `FLOW-ANALYSIS.md` — the complete-flow ceiling: which dispatch patterns
  stitch end-to-end and where each framework's walker loses the thread.
