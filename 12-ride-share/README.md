# 12-ride-share

Ride-sharing app (rides & drivers).

| Tier | Stack |
|------|-------|
| Frontend | Vue (TS) + `fetch` |
| Backend | Echo (Go) |
| Data | GORM (Postgres) |
| Cache | go-redis |
| Queue | asynq (Redis-backed task queue) |
| Storage | AWS S3 (`aws-sdk-go-v2`) |
| Realtime | `gorilla/websocket` |

Plugins exercised: `vue`, `echo`, `gorm`, `goredis`, `asynq`, `awsgo-s3`,
`ws-go` (+ `fetch`, `dom`).

```
adorable analyze 12-ride-share
```
