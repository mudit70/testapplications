# 25-polyglot-shop — one shop, four languages, five repositories

A written fixture for veoagents: a small shop split across five repositories that are analysed
one by one and then joined. Each repository's answers are in `<repo>/expected.yaml`; the joined
system's (cross-repository requests, Kafka topics, end-to-end flows) are in `expected.yaml`. All
are written from the code.

| Repository | Stack | What it holds |
| --- | --- | --- |
| `web/` | TypeScript: React + Vite | 10 UI actions; calls each backend through `import.meta.env.VITE_*_URL` (local defaults in `web/.env`) |
| `orders/` | Python: FastAPI + SQLAlchemy 2.0, httpx, aiokafka | tables `orders`, `order_items`; reserves stock in inventory over HTTP; publishes `order.placed`; consumes `payment.settled` |
| `inventory/` | Go: Gin + GORM, segmentio/kafka-go | tables `products`, `reservations`; consumes `order.placed` |
| `payments/` | Rust: Axum + sqlx, rdkafka | table `payments` (raw SQL); publishes `payment.settled` |
| `deploy/` | docker-compose | builds each service from its repository and wires the URLs (`VITE_ORDERS_URL=http://orders:8000`, `INVENTORY_URL=http://inventory:8080`, …) and the Kafka broker |

## What it proves

- **Requests across repositories and languages.** web reaches orders, inventory and payments;
  orders reaches inventory. No URL names a host in code: each base comes from the environment,
  and only `deploy/docker-compose.yml` says which repository serves it. Analysed alone, every
  such call is an Unknown `call_target` with its path; joined, each links to its endpoint.
- **Topics across languages.** `order.placed`: aiokafka `AIOKafkaProducer.send_and_wait` (Python)
  to kafka-go `kafka.NewReader(kafka.ReaderConfig{Topic: "order.placed"})` (Go).
  `payment.settled`: rdkafka `FutureProducer` with `FutureRecord::to(PAYMENT_SETTLED)` (Rust) to
  aiokafka `AIOKafkaConsumer(PAYMENT_SETTLED, …)` (Python). Topic names are literals or constants
  in the same file. Each is one `MessageChannel` (`kafka:<topic>`).
- **End-to-end flows.** *Order product*: click → web → `POST /api/orders` → `place_order` →
  `POST /api/reservations` in Go → `products`, `reservations` → `orders`, `order_items` →
  `order.placed` → `ConsumeOrderPlaced` → `reservations`. *Pay order*: click → `POST
  /api/payments` in Rust → `payments` → `payment.settled` → `consume_payment_settled` → `orders`.
- **A deliberate Unknown.** *Track shipment* fetches `order.tracking_url`, a carrier URL the
  orders API returns at run time; nothing in any repository says where it points.
- **A dead route.** `PUT /api/orders/{order_id}/address` is served by orders and requested by
  nothing.

| UI action | Reaches |
| --- | --- |
| Shop: Refresh | GET /api/products (inventory) |
| Product: Order | POST /api/orders (orders) → POST /api/reservations (inventory) → `order.placed` → inventory |
| Product: Check stock | GET /api/products/{id} (inventory) |
| Product: Restock 10 | PATCH /api/products/{id}/stock (inventory) |
| Orders: Refresh | GET /api/orders (orders) |
| Order row: Cancel | DELETE /api/orders/{order_id} (orders) → DELETE /api/reservations/{id} (inventory) |
| Order: Pay | POST /api/payments (payments) → `payment.settled` → orders; then GET /api/payments |
| Order: Show payments | GET /api/payments?order_id= (payments) |
| Order: Track shipment | `order.tracking_url`: Unknown |
| Payment: Receipt | GET /api/payments/{id} (payments) |

## Overlays

`overlays/` holds uncommitted changes for working-tree overlay tests; nothing applies them by
default. Apply one from this directory with `git apply overlays/<name>.patch` and undo it with
`git apply -R overlays/<name>.patch`:

- `add-refund-endpoint.patch`: payments gains `POST /api/payments/{id}/refund`, and web a Refund
  button on each payment that calls it.
- `rename-order-topic.patch`: orders publishes `order.placed.v2` while inventory still reads
  `order.placed`, so the topic no longer joins them.
- `drop-dead-route.patch`: removes the unused `PUT /api/orders/{order_id}/address`.
