# 64-go-sqlc-dynamic — sqlc SQL assembled from a literal, and a library's method behind an interface (React + net/http + MySQL)

A written fixture for veoagents (#441, #442): its answers are in `expected.yaml`, written from the
code. Shaped like unkey's ctrl:
- `InsertTopologies` is sqlc's bulk insert plugin: its SQL is a literal formatted with
  `fmt.Sprintf(..., "VALUES %s")`.
- `FindRoutesBySticky` is a `sqlc.slice` query: its SQL is a literal rewritten with
  `strings.Replace` in either branch.
- `authenticate` reads the request's cookie through an interface of the code that only
  `*http.Request` is ever handed as, as unkey's vault `authenticate` reads a Connect request's
  `Header()`.

| UI action | Requests | Data |
| --- | --- | --- |
| Place | POST /api/topologies | writes deployment_topology |
| Routes | GET /api/routes | reads frontline_routes |
