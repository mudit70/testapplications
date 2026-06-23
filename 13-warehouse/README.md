# 13-warehouse

Warehouse inventory service (items, stock, locations).

| Tier | Stack |
|------|-------|
| Frontend | React (TS) + `fetch` |
| Backend | Fiber (Go) |
| Data | Ent (entgo ORM) |
| Queue | Kafka (`segmentio/kafka-go`) |
| Search | Elasticsearch (`elastic/go-elasticsearch`) |
| Storage | Google Cloud Storage (`cloud.google.com/go/storage`) |
| Cache | memcached (`bradfitz/gomemcache`) |

Plugins exercised: `react`, `fiber`, `ent`, `kafkago`, `elastic-go`,
`gcs-go`, `memcache-go` (+ `fetch`, `dom`).

```
adorable analyze 13-warehouse
```
