# 52-ts-drizzle-with — Drizzle relational queries' with:

A written fixture for veoagents: its answers are in `expected.yaml`, written from the code
(veoagents #416, from openstatus's tRPC middleware and services). A relational query's `with:`
loads the related tables the schema's `relations()` declare, so each is a read.

| UI action (`web/src/Dashboard.tsx`) | Route (`api/src/server.ts`) | Query | Reads |
| --- | --- | --- | --- |
| Me | GET /api/me | `db.query.user.findFirst({ with: { usersToWorkspaces: { with: { workspace: true } } } })` | user, users_to_workspaces, workspace |
| Workspace | GET /api/workspaces/{slug} | `db.query.workspace.findFirst({ where, ...withAlerts })`, `withAlerts = { with: { monitors: true, notifications: true, usersToWorkspaces: false } }` | workspace, monitor, notification |
| Monitor | GET /api/monitors/{id} | `db.query.monitor.findFirst({ where })` | monitor |
