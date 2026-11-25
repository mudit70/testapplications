# 46-ts-route-guards — route guards on navigations

A written fixture for veoagents (#410, #411, #412). Its answers are in `expected.yaml`, written
from the code.

| UI action | Shape | Reaches |
| --- | --- | --- |
| Items link in the layout | TanStack Router runs `_layout`'s beforeLoad on every navigation into a route under it, this one that keeps the layout too | GET /api/session (the guard), GET /api/items |
| Sign up | `navigate({ to: '/login' })` without touching the token; /login's beforeLoad throws a redirect when `isLoggedIn()`, so its page's `enabled: isLoggedIn()` query never runs | POST /api/signup |
| Copy | `this.$router.push({ path: this.dest })`, a path only run time gives; the global `beforeResolve` runs anyway | POST /api/copy, GET /api/renew; the target is an Unknown |
