# 58-go-cache-loaders — one generic cache, each flow its own loader (React + net/http + GORM)

A written fixture for veoagents (#424): its answers are in `expected.yaml`, written from the code. `backend/cache` is a generic stale-while-revalidate cache behind an interface, with a tracing wrapper that wraps each loader in a closure of its own, as unkey's `pkg/cache` does. The three lookups pass different loaders, so each flow reads one table only:

| UI action | Request | Loader | Data |
| --- | --- | --- | --- |
| Load user | GET /api/users/{id} | a closure | users |
| Load team | GET /api/teams/{id} | a closure | teams |
| Load plan | GET /api/plan | the method value `s.loadPlan` | plans |
