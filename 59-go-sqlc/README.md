# 59-go-sqlc — sqlc queries on a DBTX wrapper (React + net/http + MySQL)

A written fixture for veoagents (#423): its answers are in `expected.yaml`, written from the code.
`backend/db` is shaped like sqlc's output in unkey's `pkg/db`: each query is a const of SQL (with
sqlc's `-- name:` comment and backtick-quoted MySQL names) handed to the `DBTX` it is given, and
the handlers run them on a `Replica` that runs whatever query it is given.

| UI action | Request | Query | Data |
| --- | --- | --- | --- |
| Load project | GET /api/projects/{id} | `FindProjectByID` (QueryRowContext) | projects |
| Load deployments | GET /api/projects/{id}/deployments | `ListDeploymentsByProject` (QueryContext, a JOIN) | deployments, projects |
| Deploy | POST /api/projects/{id}/deployments | `InsertDeployment` (ExecContext) | writes deployments |
