# 45-ts-query-enabled — a mount query's enabled condition on the navigation path

A written fixture for veoagents (#405), in the shape of full-stack-fastapi-template. Its answers
are in `expected.yaml`, written from the code.

`useAuth`'s currentUser query is `enabled: isLoggedIn()`, and `isLoggedIn` reads
`localStorage.getItem('access_token') !== null`.

| UI action | Path | Reaches |
| --- | --- | --- |
| Add item | the mutation; on failure the MutationCache `onError` removes the token and reloads /login, where the login page's `useAuth` query is disabled | POST /api/items |
| Log in | POST /api/login, the token stored, then home: Home's `useAuth` query runs | POST /api/login, GET /api/users/me |
| Log out | the token removed, then /login: its query is disabled | nothing |
