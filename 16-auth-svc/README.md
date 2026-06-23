# 16-auth-svc

Authentication service (register, login, profile, logout, avatar upload, session events).

| Tier | Stack |
|------|-------|
| Frontend | React (TS) + `fetch` |
| Backend | Warp (Rust) |
| Data | SeaORM (Postgres) |
| Outbound HTTP | `reqwest` (external identity provider) |
| Cache | memcached (`memcache` crate) |
| Storage | Azure Blob Storage (`azure_storage_blobs`) |
| Realtime | `tokio-tungstenite` WebSocket |

Plugins exercised: `react`, `warp`, `seaorm`, `reqwest`, `memcache-rs`,
`azure-blob-rs`, `ws-rs` (+ `fetch`, `dom`).

```
adorable analyze 16-auth-svc
```
