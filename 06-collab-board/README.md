# 06-collab-board

Realtime collaborative board (Trello-like).

| Tier | Stack |
|------|-------|
| Frontend | Angular (TS) + `fetch` |
| Backend | Express (TS) |
| Data | TypeORM (Postgres) |
| Queue | BullMQ |
| Storage | AWS S3 (`@aws-sdk/client-s3`) |
| Realtime | `ws` WebSocket server |
| Routing | `vercel.json` redirects |

Plugins exercised: `angular`, `express`, `typeorm`, `bullmq`, `aws-s3-ts`,
`ws-ts`, `redirects` (+ `fetch`, `dom`).

```
adorable analyze 06-collab-board
```
