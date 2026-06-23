# 09-recipe-share

Recipe sharing app (recipes & users).

| Tier | Stack |
|------|-------|
| Frontend | React (TS) + `fetch` |
| Backend | Flask (Python) |
| Data | SQLModel (Postgres) |
| Cache | memcache (`pymemcache`) |
| Queue | Celery |
| Storage | Google Cloud Storage (`google-cloud-storage`) |
| Outbound HTTP | `httpx` (external recipe API) |

Plugins exercised: `react`, `flask`, `sqlmodel`, `memcache-py`, `celery`,
`gcs-py`, `httpx` (+ `fetch`).

```
adorable analyze 09-recipe-share
```
