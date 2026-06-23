# 23-deepfleet-go — Dispatch-Rung Matrix (React + Gin + GORM, Postgres)

A small fleet-management app whose real purpose is a **controlled dispatch-rung
experiment** for the `adorable` static analyzer. The same "load data" feature is
implemented many times with *different* dispatch patterns so the analyzer's
per-flow `completeness` output reveals which rungs stitch a complete
UI handler → client caller → server endpoint → DB flow in the Go/Gin stack.

## Stack / detected plugins

`react`, `gin`, `gorm`, `fetch` (+ `dom`, `react-router` incidental). All four
required plugins detected; verify shows no `Missing`.

- `backend/go.mod` requires `github.com/gin-gonic/gin`, `gorm.io/gorm`,
  `gorm.io/driver/postgres` — import paths match the `.go` files exactly.
- Gin routes: `r.Group("/api")` + `.GET/.POST/.PUT/.DELETE`.
- GORM idioms: `db.Find / First / Create / Save / Delete` with model structs
  (`Vehicle`, `Driver`, `Trip`); struct-field receivers `r.db` / `s.db`.

## verify row

| App | Files | Detected | Missing | Endpoints | Callers | DB ops | Complete | Partial |
|-----|-------|----------|---------|-----------|---------|--------|----------|---------|
| 23-deepfleet-go | 21 | 8 | — | 27 | 19 | 35 | 0 | 18 |

## Feature → rung → completeness

Each feature = one React component + one Gin route; the caller URL literal
matches the route path exactly. F1–F6 vary the FRONTEND dispatch (backend held
inline). F7–F9 vary the BACKEND dispatch (frontend held = fe-modulefn).

| Feature | Rung | Dispatch chain | Completeness | Notes |
|---------|------|----------------|--------------|-------|
| F1 | fe-inline | handler → `fetch('/api/f1')` | **endpoint-only** | caller→endpoint stitches (exact-url) |
| F2 | fe-localfn | handler → same-file fn → fetch | **endpoint-only** | same |
| F3 | fe-modulefn | handler → imported `api.ts` fn → fetch | **endpoint-only** | same |
| F4 | fe-classmethod | handler → `apiClient.getF4()` → fetch | **endpoint-only** | resolves (also surfaces a `? /api/f4` caller variant) |
| F5 | fe-hook | handler → hook-returned fn → fetch | **function-only** | degraded: caller inside `useCallback` not attributed to the reachable fn set |
| F6 | fe-wrapper-dynamic | handler → `request(path)` → `fetch(path)` | **caller-only** | degraded by design: dynamic URL → no endpoint match (`GET ?`) |
| F7 | be-localfn | handler → same-pkg fn → gorm | **endpoint-only** | backend hops never traversed (see ceiling) |
| F8 | be-modulefn | handler → `internal/repo` fn → gorm | **endpoint-only** | same |
| F9 | be-structmethod | handler → `service` struct method → gorm | **endpoint-only** | same |

Plus realistic CRUD extras (Vehicle/Driver/Trip list/create/get/update/delete,
trip-complete, fleet/idle stats) — 27 endpoints, 35 GORM interactions total.

## The ceiling — why no Go/Gin flow reaches `complete`

The maximum completeness achievable in this stack is **`endpoint-only`**.
Root cause: the Gin framework plugin emits every `APIEndpoint` with
`handlerFunctionId: null` (explicit `TODO: resolve Go handler functions` in
`framework-gin/src/visitor.ts`). The flow-walker requires a non-null
`handlerFunctionId` to traverse endpoint → handler → DB. With that link severed,
**no backend dispatch pattern can stitch the endpoint to its GORM call** — F7
(local fn), F8 (module fn) and F9 (struct method) are all indistinguishable from
inline at the flow level (`svcHops=0`, `dbHops=0`). The 35 `DatabaseInteraction`
nodes are detected but cannot be reached from any flow.

### What this isolates

- **Frontend chain resolves well**: F1–F4 (inline, local fn, module fn, class
  method) all resolve UI handler → caller → endpoint and reach the
  endpoint-only ceiling. The caller→endpoint matcher handles exact-url and
  path-param `pattern` matches (`/api/trips/:id/complete`, `/api/vehicles/:id`).
- **F5 fe-hook degrades** one rung to `function-only`: the `fetch` caller lives
  inside a `useCallback` returned from the hook, and is not attributed to the
  handler's reachable function set.
- **F6 fe-wrapper-dynamic degrades** to `caller-only`: the generic `request(path)`
  wrapper passes a variable to `fetch`, so no URL literal is resolvable.
- **Backend rungs (F7–F9) are a wash** at `endpoint-only` — the degradation is
  in the Gin plugin (null handler id), not in the dispatch pattern.

### completeness tally
`{ endpoint-only: 16, function-only: 1, caller-only: 1 }` → 18 partial, 0 complete.
