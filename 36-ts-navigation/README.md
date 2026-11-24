# 36-ts-navigation — navigations and what their destinations load

A written fixture for veoagents (#384): its answers are in `expected.yaml`, written from the code.
A navigation is a step one hop deep, with the destination's guards and loading (the user's
rulings); each UI action here reaches its endpoints only through one.

| UI action | Shape | Reaches |
| --- | --- | --- |
| vue-web Login submit | `router.push({ path: redirect })` on `useRouter()`, redirect from the query or `/files/`; the global `beforeResolve` guard; `/files` renders Layout around its `:path*` child Files | POST /api/login, GET /api/renew (guard), GET /api/resources (Files' onMounted); the query's redirect is an Unknown |
| vue-web Layout log out | `router.push` on the router imported from `@/router` | GET /api/renew (guard) |
| react-web Login | `navigate({ to: '/' })` after the request: the pathless `_layout`'s beforeLoad, its Layout (Sidebar's `useAuth` query) and the index page | POST /api/login, GET /api/users/me |
| Sidebar links | `<RouterLink to={item.path}>` over a literal list (`/`, `/items`) | GET /api/users/me, GET /api/items |
| Sidebar "All items" | `<RouterLink to="/items">`; the query is two components below the route's own | GET /api/items |
| Switch workspace | `window.location.href = '/'`: the whole document loads, the layout too | GET /api/users/me |
| Add to Slack | `location.href` to another app's host, chosen by environment | hooks.navfixture.dev, hooks.staging.navfixture.dev |
