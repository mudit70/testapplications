# 49-ts-vue-router-link

A Vue front end (`web`) on vue-router and its Express API (`api`), for veoagents #440.

`views/Home.vue`'s `<router-link>` / `<RouterLink>` elements navigate as `router.push(to)`
would. On each one, the router's global `beforeEach` (`GET /api/renew`) runs and the
destination's component mounts:

- `to="/settings"`: a literal path (`GET /api/settings`).
- `:to="'/users/' + userId"`: a bound concatenation (`GET /api/users/{id}`).
- `:to="{ name: 'Files' }"`: a named route (`GET /api/resources`).
- `:to="lastVisited"`: a value read at run time. Only the global guard is known, and the target
  is a `navigation_target` Unknown.

- `views/Files.vue`'s `to="/files/docs"` stays on its route. The page stays mounted, so its
  `watch(route, …)` fetches the listing again, rather than its `onMounted`.

Links without an `@click` of their own are `router-link:navigate#n` elements.

Answers are in `expected.yaml`, written from the code.
