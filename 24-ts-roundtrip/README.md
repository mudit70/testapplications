# 24-ts-roundtrip — every way a UI action can end (React + Express + Prisma)

A written fixture for veoagents: its answers are in `expected.yaml`, written from the code. Each UI
action uses a different dispatch pattern, and together they cover every outcome kind of a round
trip, from the click to what the user sees.

| UI action | Dispatch pattern | Request | Outcomes |
| --- | --- | --- | --- |
| Place order | custom hook | POST /api/orders | 201 navigate; 400 inline error; 401 from `requireAuth` middleware; 404, 409 and 500 from the error handler; 502 from the downstream payments service; network error; 429 at a gateway is **unknown** (no infrastructure in the repo) |
| Generate invoice | inline arrow, wrapper with method | POST /api/invoices/:orderId | **200 with ok:true / ok:false**: status alone does not tell them apart |
| Download receipt | local function | GET /api/orders/:id/receipt | 200 saves the file; the error outcome is **confirmed absent**: the client never checks the status |
| Export orders | class method, polling | POST /api/exports (202), GET /api/exports/:id | **eventual**: `processExports` finishes the job and polling sees it; a 404 while polling is never handled |
| Search | form submit, module function, wrapper | GET /api/orders | 200 list; error status shown inline |
| Cancel | inline arrow, local function, wrapper | DELETE /api/orders/:id | 204 removes the row; `NotFoundError` becomes 404 |
| Share feedback | inline arrow, config-driven URL | POST to `config.telemetryUrl` | fire and forget: **never completes**; the target is an Unknown |

`backend/src/legacyRoutes.ts` defines a router that nothing mounts: `GET /api/legacy/orders` must not appear.
