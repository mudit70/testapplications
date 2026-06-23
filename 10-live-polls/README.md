# 10-live-polls

Live polling app — list polls, create polls, cast votes, search, and
stream live results over a WebSocket.

| Tier | Stack |
|------|-------|
| Frontend | Vue (TS) + `fetch` |
| Backend | aiohttp (Python) |
| Data | Tortoise ORM |
| Realtime | `websockets` (ws-py) |
| Queue | `pika` (RabbitMQ) |
| Search | Elasticsearch (`elasticsearch`) |

Plugins exercised: `vue`, `aiohttp`, `tortoise`, `ws-py`, `pika`,
`elastic-py` (+ `fetch`, `dom`).

```
adorable analyze 10-live-polls
```
