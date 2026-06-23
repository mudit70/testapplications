# 21-deepshop-ts — dispatch-rung matrix (React + Express + Prisma, Postgres)

A small e-commerce app whose real purpose is a **controlled experiment**: implement the
same kind of feature many times, each wired with a *different* code-dispatch pattern, so
the analyzer's flow output reveals which dispatch "rungs" let it stitch a COMPLETE
end-to-end flow (UI handler -> client caller -> server endpoint -> DB).

- `frontend/` — React + TS (Vite). Components, `lib/api.ts`, `lib/ApiClient.ts`,
  `lib/useApi.ts`, `lib/http.ts`.
- `backend/` — Express + TS + Prisma. `src/server.ts` (routes), `src/db.ts` (shared
  PrismaClient), `src/productRepo.ts` (repo module), `src/orderService.ts` (service class),
  `prisma/schema.prisma` (Product / Order / OrderItem / Cart / CartItem on Postgres).

Each feature `Fn` = one React component with one event handler + one Express route at
`/api/fn`. The caller URL literal exactly matches the route path so they stitch. Each
route's prisma call is genuine CRUD on a real model.

## Detected plugins
`react`, `express`, `prisma`, `fetch` (plus `dom`, `typescript`).

## The matrix

### Frontend rungs (handler -> ... -> fetch), backend held = be-inline
The backend body is the same shape for F1–F6 (the prisma call lives directly in the route's
**named** handler function), so any incompleteness is attributable to the FE dispatch pattern.

| Feature | FE rung            | BE rung    | FE dispatch (handler -> fetch)                                   | Completeness   |
|---------|--------------------|------------|------------------------------------------------------------------|----------------|
| F1      | fe-inline          | be-inline  | handler body calls `fetch('/api/f1')` directly                   | **complete**   |
| F2      | fe-localfn         | be-inline  | handler calls same-file fn that calls `fetch('/api/f2')`         | **complete**   |
| F3      | fe-modulefn        | be-inline  | handler calls imported `api.ts` fn that calls `fetch('/api/f3')` | **complete**   |
| F4      | fe-classmethod     | be-inline  | handler calls `apiClient.f4...()` whose method calls fetch       | **complete**   |
| F5      | fe-hook            | be-inline  | handler calls `run()` returned by `useApi()` custom hook         | function-only  |
| F6      | fe-wrapper-dynamic | be-inline  | handler calls `request(path)` wrapper (URL is the parameter)     | caller-only    |

### Backend rungs (route handler -> ... -> prisma), frontend held = fe-modulefn
The frontend caller is the `api.ts` module-function pattern (same as F3); only the backend
path between the route handler and prisma varies.

| Feature | FE rung     | BE rung         | BE dispatch (handler -> prisma)                          | Completeness |
|---------|-------------|-----------------|----------------------------------------------------------|--------------|
| F7      | fe-modulefn | be-localfn      | handler calls same-file fn that does prisma              | **complete** |
| F8      | fe-modulefn | be-modulefn     | handler calls imported `productRepo.ts` fn that does prisma | **complete** |
| F9      | fe-modulefn | be-classmethod  | handler calls `orderService.listOrders()` (service class) | **complete** |

### Extra realistic endpoints
Products (`/api/products`, `/api/products/:id`, `/api/products/:id/stock`), Orders
(`/api/orders`, `/api/orders/:id/cancel`), Cart (`/api/cart/:sessionId`,
`/api/cart/:sessionId/items`, `/api/cart/items/:itemId`), and `/api/health`. ~21 endpoints,
16 callers, 20 DB ops total.

## Result summary (what reached `complete`)

| Rung               | Result        | Why |
|--------------------|---------------|-----|
| fe-inline          | complete      | fetch call site is directly in the handler function. |
| fe-localfn         | complete      | same-file callee is followed via the call graph. |
| fe-modulefn        | complete      | imported module fn resolves cross-file (the app-01 pattern). |
| fe-classmethod     | complete      | imported instance method resolves to the fetch inside it. |
| fe-hook            | function-only | the function value returned by the custom hook is not traced to the inner fetch; no ClientSideAPICaller is emitted. |
| fe-wrapper-dynamic | caller-only   | the wrapper emits a resolved caller for the literal arg, but the method (`DELETE`) is not propagated through the wrapper, so it defaults to GET and the URL-only match fails against the DELETE endpoint. |
| be-inline          | complete      | prisma call is directly in the named handler function. |
| be-localfn         | complete      | same-file callee followed via CALLS_FUNCTION BFS. |
| be-modulefn        | complete      | imported repo-module fn resolves cross-file. |
| be-classmethod     | complete      | instantiated service-class method resolves to its prisma call. |

**Ceiling observed:** the FE dispatch ceiling is **fe-hook** (a function value returned from
a hook closure is not followed) and **fe-wrapper-dynamic** (dynamic-URL wrappers drop the
method, so only URL matching is attempted). Every backend rung (inline, localfn, modulefn,
classmethod) reaches complete. On the frontend, everything up to and including
fe-classmethod reaches complete.

> Note on `be-inline`: "inline" means the prisma call lives directly in the route handler
> (no service/repo indirection). The handler is registered as a **named function reference**
> (`app.get('/api/f1', f1Handler)`) rather than an anonymous arrow callback, because the
> analyzer only sets `endpoint.handlerFunctionId` for named handlers — an anonymous
> `app.get('/api/f1', async (req,res) => {...})` arrow yields `handlerFunctionId: null` and
> the flow can never reach the DB (it stays `endpoint-only`). This is itself a measured
> finding about the express handler-resolution ceiling.
