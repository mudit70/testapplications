# 33-go-wrappers — shared Go handler wrappers (React + gorilla/mux + GORM)

A written fixture for veoagents: its answers are in `expected.yaml`, written from the code. The
backend is shaped like filebrowser's `http` package: every route is `monkey(h)`, which is
`handle(h, db)`, and most handlers are `withUser(…)` or `withAdmin(…)` closures held in
package-level variables. The wrappers' closures are shared by all the routes, so an analyzer that
follows a wrapper's `fn(w, r, d)` to every function wrapped the same way puts every handler, and
every table, in every flow.

| UI action | Request | What only it reaches |
| --- | --- | --- |
| Sign in | POST /api/login | `login` reads `users`; no `withUser` |
| Load notes | GET /api/notes | reads `notes` |
| Add note | POST /api/notes | `runHook(func() error {…})` writes `notes` |
| Delete attachment | DELETE /api/attachments | `runHook(func() error {…})` writes `attachments` |
| Save settings | PUT /api/settings, then POST /api/renew | through `withAdmin` writes `settings`; the renew writes `sessions`: two routes in one flow through the same wrappers |

Every route's `handle` closure reads `settings`; every route but sign-in's `withUser` closure
reads `users`.

Router middleware: `r.Use` (CSP) runs on every route, also those of the router mounted at `/static`; `api.Use(requestLog)` and then `withTiming`'s Use on the `/api` routes only. `admin/` is a Gin service: its `Use(audit)` runs only on the routes registered after it, and `Group("/admin", requireAdmin)` runs `requireAdmin`.
