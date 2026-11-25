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
| rust-react-todo | React | Axum (Rust) | sqlx (Postgres); README holds the five ground-truth flows |

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

### Written fixtures (veoagents)

Apps numbered from 24 are written for veoagents' phase gate, each with an `expected.yaml` of
answers written from the code: nodes, edges, flows, outcomes and slot states (present, confirmed
absent, unknown with a reason) and what must not appear. The harness that scores them is
`packages/harness` in veoagents.

| App | Stack | What it proves |
|-----|-------|----------------|
| 24-ts-roundtrip | React + Express + Prisma | every outcome kind of a round trip, 200 with ok:false, a missing status check |
| 25-polyglot-shop | React (TS) + FastAPI (Py) + Gin (Go) + Axum (Rust), Kafka, docker-compose | five repositories joined: requests linked by configured base URLs, Kafka topics across languages, end-to-end flows, an Unknown run-time URL, a dead route |
| 31-ts-trpc | Next.js + tRPC 11 + Prisma | tRPC procedures from both client styles, nested and merged routers, an unserved router, server actions |
| 32-py-fastapi-sqlmodel | FastAPI + SQLModel | Annotated dependency aliases and their own Depends, session add/delete of model_validate instances, mail through emails (configured host) and smtplib (literal host) |
| 33-go-wrappers | React + gorilla/mux + GORM | shared handler wrappers (handle, withUser, withAdmin) and a hook runner: each route reaches only its own handler |
| 34-go-storm | React + net/http + storm (BoltDB) | storm buckets: a struct's by its type name, a query's destination, a named key-value bucket |
| 35-ts-server-steps | Next.js + Express + Go (Connect), Drizzle, NextAuth | SDK clients made elsewhere (singleton, class field, nullable types, unlisted credentialed package), NextAuth auth() session reads, writes in db.transaction, express-jwt route middleware, a Connect RPC to the Go service beside it |
| 36-ts-navigation | Vue Router + TanStack Router + Express | navigations and what their destinations load: an imported router's push, global and beforeLoad guards, nested and pathless layouts, Link elements, mount queries, whole-document loads, another app's host |
| 37-ts-webhooks | Next.js + Stripe + WorkOS, Drizzle | SDK operations followed by the webhooks their services deliver (Stripe subscription events, WorkOS user.created), matched by the event types the handlers switch on; an operation no handler answers |
| 38-ts-constant-guards | React + Express | branches a constant argument rules out: a true passed into a constant built of it, a false into a guard, a URL that surely ends in "/" |
| 39-ts-xhr-tus | React + Express | requests through XMLHttpRequest (open, send) and tus-js-client (Upload.start: creation POST, then PATCH chunks), and a URL rebuilt from a parameter before the request |
| 40-ts-reactive-refetch | Vue + Pinia + TanStack DB + Express | refetches through reactive state: a store flag and field that watchers fetch on (storeToRefs, a getter, mapWritableState, an options store action; a value the watcher skips), and a TanStack DB collection invalidated by key or refetched |
| 41-ts-context-values | React + react-hook-form + Express | a context's functions through a hook of the app's that returns the context read, a form field's onChange handed to a component of the app's, and the app's own API called by its public address (no outside service) |
| 42-ts-mutations | React + TanStack Query + Express | what runs around a mutation: onSuccess from a factory, a bound onError, an onSettled invalidation by key prefix, the MutationCache's onError, refetch() in onSuccess, startTransition |
| 43-ts-redux | React classes + Redux + Express | props mapDispatchToProps gives (handed on through a parent's this.props), curried and constructor-made handlers, navigation through a reducer's redirectTo |
| 44-ts-vue-inline | Vue + Pinia + Express | Vue template handlers written as inline expressions: a store action, two calls, an arrow, a call of the script's function with a modifier, and an assignment (state only) |
| 45-ts-query-enabled | React + TanStack Query + TanStack Router + Express | a mount query enabled on a stored token: not run where the path removed it (a MutationCache onError reload, a logout), run where it was just stored |
| 46-ts-route-guards | TanStack Router + Vue Router + Express | route guards on navigations: a kept layout's beforeLoad, a destination guard that leaves the token absent, vue-router's global guard on a run-time target |
| 47-ts-then-watch | Vue + Pinia + Express | a .then on the promise of a function held in a local whose callback only sets a watched store flag, and a write of a value the watcher skips (nothing of it runs) |
| 48-ts-store-callbacks | Vue + Pinia + Express | callbacks a store keeps and a prompt runs: showHover({ prompt, confirm }) into state, a getter of the last record, confirm() from a method, a template and a destructure, matched by the prompt name a registry maps to components |
| 52-ts-drizzle-with | React + Express + Drizzle | relational queries' with: (nested, spread from a constant, a relation set false): each related table the schema's relations() declare is a read |
| 53-ts-trpc-meta | Next.js + tRPC + OpenPanel | a middleware's after() work a procedure's .meta({ track }) decides: tracked for a procedure that sets it, not for one without meta |
| 54-ts-literal-input | Next.js + tRPC + react-hook-form | a procedure's branch on the input a client gives as a literal (stated, or fixed by the form's zod schema), and one not known (every branch) |
| 55-ts-default-base | React + workspace packages | a client's base URL from a literal default: a constructor's fallback for this.baseUrl, and a factory's default parameter through a let read in a loop, in packages the app calls |
| 56-ts-hono-use | Hono + React | a Hono sub-router's use("*") and use("/events") middleware on its routes once mounted with app.route(), served under the mount only |
| 58-go-cache-loaders | React + net/http + GORM | one generic cache behind an interface and a tracing wrapper: each flow reaches only its own loader |
| 59-go-sqlc | React + net/http + MySQL (sqlc) | sqlc queries (a -- name: comment, backtick-quoted names) handed to a DBTX wrapper: tables read where the query passes its SQL |
| 60-go-restate | React + net/http + GORM + Restate | a generated Restate ingress client's Send reaches the service handler the repository registers |
| 61-go-redis | React + net/http + go-redis | a redis upload cache behind an interface: each go-redis Set, Get, Expire and Del of a key a method builds is a read or write of its key family |
| 62-ts-redux-store-fn | React + Redux + Express | a function prop read from the store (mapStateToProps spreads a slice): each list-loading action's pager, from the functions and closures its dispatches are given |
| 63-ts-sdk-field | Next.js + a workspace package | an SDK client a class of the code holds in a field, called from outside the class; a route handler's req.json() |
| 64-go-sqlc-dynamic | React + net/http + MySQL (sqlc) | sqlc SQL assembled from a literal (a bulk insert's Sprintf, sqlc.slice's strings.Replace) reads its tables; a library's method behind an interface of the code is no Unknown |

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
