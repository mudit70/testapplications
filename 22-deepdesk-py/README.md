# 22-deepdesk-py — FastAPI + SQLAlchemy dispatch-rung matrix

A small helpdesk app (React TS + FastAPI + SQLAlchemy/Postgres) whose real
purpose is a **controlled experiment**: implement the same kind of feature many
times with **different code-dispatch patterns**, then read adorable's flow
output to see which patterns let it stitch a COMPLETE end-to-end flow
(UI handler → client caller → server endpoint → DB).

Domain models: `Ticket`, `Agent`, `Comment` (SQLAlchemy ORM, declarative_base,
`session.query(...).all()/.filter()/.get()`, `session.add/commit/refresh`).

## How to run the analysis

```
cd ../              # testapplications/
node verify.mjs 22-deepdesk-py     # plugin detection + node counts
node flowreport.mjs 22-deepdesk-py # per-flow completeness table
```

## Plugins detected

`react`, `fastapi`, `sqlalchemy`, `fetch` (all 4 expected) plus `dom`,
`react-router`, etc. — no missing.

verify row:

| App | Files | Detected | Missing | Endpoints | Callers | DB ops | Complete | Partial |
|-----|-------|----------|---------|-----------|---------|--------|----------|---------|
| 22-deepdesk-py | 29 | 7 | — | 22 | 20 | 19 | 9 | 13 |

## The experiment

Each feature `Fn` = one React component (one event handler) + one FastAPI
endpoint at `/api/fn`. The caller URL literal matches the route exactly.

- **F1–F6** hold the **backend rung = inline** (the path operation function
  calls SQLAlchemy directly) and vary the **frontend dispatch**.
- **F7–F9** hold the **frontend rung = fe-modulefn** (handler → imported fn in
  `api.ts` → `fetch`) and vary the **backend dispatch**.

### Feature → rung → completeness

| Feature | Rung (varied layer) | Dispatch path | Completeness |
|---------|---------------------|---------------|--------------|
| F1 | fe-inline | handler → `fetch('/api/f1')` | **complete** |
| F2 | fe-localfn | handler → same-file fn → `fetch('/api/f2')` | **complete** |
| F3 | fe-modulefn | handler → imported fn (`api.ts`) → `fetch('/api/f3')` | **complete** |
| F4 | fe-classmethod | handler → method on imported class instance → `fetch('/api/f4')` | **complete** |
| F5 | fe-hook | handler → fn returned by custom hook → `fetch('/api/f5')` | degraded (function-only — handler not linked across hook boundary) |
| F6 | fe-wrapper-dynamic | handler → generic `request(path)` wrapper (dynamic URL) → `fetch(path)` | **complete** (call-site URL resolved) |
| F7 | be-localfn | path fn → same-file fn → SQLAlchemy | **complete** (dbHops=1) |
| F8 | be-modulefn | path fn → imported repository fn → SQLAlchemy | degraded (handler-only — endpoint matched, DB hop through imported module not traced) |
| F9 | be-classmethod | path fn → service class instance method → SQLAlchemy | degraded (handler-only — endpoint matched, DB hop through service method not traced) |

### Which rungs reached `complete` vs degraded

**Complete (7 of 9 experiment features):** F1 fe-inline, F2 fe-localfn,
F3 fe-modulefn, F4 fe-classmethod, F6 fe-wrapper-dynamic, F7 be-localfn —
plus the realistic parametrized `PUT /api/tickets/{id}` and
`DELETE /api/tickets/{id}` (matched by `pattern`). Total **9 complete flows**.

**Degraded (expected):**
- **F5 fe-hook** — the handler calls a function *returned by a custom hook*.
  The analyzer cannot link the handler to the `fetch` across that indirection,
  so the flow lands as `function-only` (the hook's own `fetch('/api/f5')` is
  seen but not attributed to the handler).
- **F8 be-modulefn** and **F9 be-classmethod** — the UI→caller→endpoint chain
  stitches fine (`handler-only`, endpoint matched by `exact-url`), but the
  **backend DB hop is lost**: when the path operation delegates to an imported
  repository function (F8) or a service-class instance method (F9), the walker
  does not follow into that module/method to find the `session.query/add`, so
  `dbHops = 0`. The same logic *inline* (F1–F6) or via a *same-file* function
  (F7) does resolve to `dbHops = 1`.

### Takeaways

- FastAPI **app-level decorators with full literal paths** + **fetch with a
  static (or call-site-resolvable) URL literal** + **inline or same-file
  SQLAlchemy** is the reliably complete-stitching combination.
- Frontend indirection degrades only at the **custom-hook** rung; module
  functions, imported class methods, and even a dynamic wrapper with a literal
  call-site argument all complete.
- Backend indirection degrades once the DB work moves **out of the path
  function's own module** (imported repo module or service-class method): the
  endpoint still matches but the DB leg is dropped.

> Implementation note: the `backend/app/routers/*.py` modules are reserved
> stubs (NOT included by `main.py`). An earlier version mounted endpoints via
> several `APIRouter` instances + `include_router(prefix=...)`; adorable's
> FastAPI router-identity resolution collapsed all routers onto a single
> prefix, so the active endpoints were moved to app-level decorators in
> `main.py`. The stubs document that degraded rung.
