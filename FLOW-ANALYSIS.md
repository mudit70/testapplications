# Flow-stitching ceiling analysis (Phase 2)

Phase 1 (apps 06–20) confirmed **plugin detection** across all 112 framework
plugins but produced **0 complete end-to-end flows**. Phase 2 asks the real
question: *how much code complexity can adorable's flow walker follow before a
flow degrades from `complete` to partial?*

A flow is **complete** only when the walker links the whole chain:

```
UI handler (ClientSideProcess) → client caller (fetch/axios) → API endpoint
→ endpoint handler function → ≥1 database hop
```

Partial flows carry a `completeness` reason that tells us exactly where the
walker lost the thread:

| value | meaning — where it broke |
|---|---|
| `complete` | full chain resolved |
| `caller-only` | handler→caller found, but caller URL didn't match an endpoint |
| `endpoint-only` | caller↔endpoint matched, but endpoint→handler→DB not traversed |
| `handler-only` | endpoint handler resolved, but it didn't reach a DB hop |
| `function-only` | the UI handler never reached a caller at all |

## Method

Three deliberately deep apps (21 TS, 22 Python, 23 Go) implement the **same
feature repeatedly** across a dispatch-rung matrix. Each feature pairs a
frontend dispatch pattern (handler → … → `fetch`) with a backend dispatch
pattern (endpoint → … → ORM), with the caller URL literal matched to the
route so stitching *can* happen. `flowreport.mjs <app>` prints the per-flow
`completeness`, so each rung's result is read directly.

Frontend rungs: **inline** · **same-file helper** · **imported module fn** ·
**imported class method** · **custom-hook return value** · **dynamic/wrapper URL**.
Backend rungs: **inline** · **same-file fn** · **imported module fn** ·
**class/struct service method**.

## Results

| App | Stack | Endpoints | Complete | Partial |
|-----|-------|-----------|----------|---------|
| 21-deepshop-ts | React + Express + Prisma | 21 | **13** | 5 |
| 22-deepdesk-py | React + FastAPI + SQLAlchemy | 22 | **9** | 13 |
| 23-deepfleet-go | React + Gin + GORM | 27 | **0** | 18 |

### Frontend dispatch ceiling (same across all three stacks)

| FE rung | result | notes |
|---|---|---|
| inline `fetch` in handler | ✅ reaches caller | |
| same-file helper → fetch | ✅ | |
| imported module fn → fetch | ✅ | the pattern app 01 uses |
| imported class-instance method → fetch | ✅ | better than expected — instance methods ARE resolved |
| **custom-hook return value** (`const {run}=useApi()`) → fetch | ❌ `function-only` | the fetch inside a hook-closure return value is not traced to the handler; no caller emitted. Held with and without `useCallback`. |
| **dynamic/wrapper URL** (`request(path)`) | ⚠️ `caller-only` | the literal call-site arg resolves to a caller, but the HTTP **method** isn't propagated through the wrapper (defaults to GET), so a `DELETE`/`POST` endpoint won't match |

The client-side walker is robust: it follows inline, same-file, cross-file
module functions, **and** imported class-instance methods. It loses the thread
only at (a) a function value returned from a custom hook and (b) URL/method
carried through a generic wrapper parameter.

### Backend dispatch ceiling — diverges sharply by framework

This is where the three stacks differ, and it is a **plugin-level** difference,
not a dispatch-pattern one.

**Express (TS) — deepest reach.** Every backend rung reached `complete`,
including the class-service method (F9). One hard requirement surfaced:

> The route must use a **named handler reference** — `app.get('/x', handler)`.
> With an **inline arrow** — `app.get('/x', async (req,res)=>{…})` — every flow
> came back `endpoint-only` with `dbHops=0`. `resolveHandlerToFunctionId`
> (`packages/lang-ts/src/resolve-handler.ts`) returns `null` for arrow/function
> expressions, so the endpoint has no `handlerFunctionId` for the DB-hop BFS to
> start from. Switching to named handlers turned 0 → 13 complete.

**FastAPI (Python) — reaches one hop.** Inline and same-file-function DB work
complete; but as soon as the path function delegates to an **imported repository
function** (F8) or a **service-class method** (F9), the DB hop is dropped
(`handler-only`, `dbHops=0`). So the Python backend walker does not follow DB
work out of the path operation's own module. Also surfaced: multiple
`APIRouter` instances with `include_router(prefix="/api")` **collapse** — one
router's prefix was applied to all routers' routes, breaking URL matching.
App-level decorators with full literal paths are the reliable pattern.

**Gin (Go) — cannot complete at all.** Ceiling is `endpoint-only` for *every*
backend rung. The Gin plugin hardcodes `handlerFunctionId: null` on every
endpoint (explicit `TODO: resolve Go handler functions` in
`packages/framework-gin/src/visitor.ts`). With no handler id, the walker can
never traverse endpoint→handler→DB, so the 35 detected GORM interactions are
unreachable from any flow. The Go backend rungs F7/F8/F9 are therefore
indistinguishable. (The frontend chain still isolates cleanly: F1–F4
`endpoint-only`, F5 `function-only`, F6 `caller-only`.)

## The ceiling, in one paragraph

adorable's flow walker handles substantial **frontend** indirection — inline,
same-file, cross-file module functions, and class-instance methods all stitch;
it breaks only on custom-hook return values and wrapper-carried URL/method.
The **backend** reach is gated by per-framework handler resolution: Express
follows handler→service-class→ORM to the full depth (given *named* handlers),
FastAPI follows only DB work that stays in the path function's module, and Gin
resolves no handler at all so nothing completes. The highest-leverage analyzer
fixes, in order: (1) resolve Go/Gin handler functions, (2) follow FastAPI DB
work into imported/repository/service modules, (3) resolve Express inline-arrow
handlers, (4) trace fetch through custom-hook closures and propagate method
through request wrappers.

## Reproduce

```
node verify.mjs 21-deepshop-ts 22-deepdesk-py 23-deepfleet-go   # detection + counts
node flowreport.mjs 21-deepshop-ts                              # per-flow completeness
node flowreport.mjs 22-deepdesk-py
node flowreport.mjs 23-deepfleet-go
```
