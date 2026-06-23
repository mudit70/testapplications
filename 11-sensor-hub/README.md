# 11-sensor-hub

IoT sensor ingestion hub: register devices, post readings, upload firmware.

| Tier | Stack |
|------|-------|
| Frontend | React Native (TS) + `fetch` |
| Backend | Tornado (Python) |
| Metadata | Peewee ORM (SQLite) |
| Readings | PyMongo (MongoDB) |
| Queue | `kafka-python` |
| Storage | Azure Blob Storage (`azure-storage-blob`) |
| RPC | `grpcio` (aggregate stats service) |

Plugins exercised: `react-native`, `tornado`, `peewee`, `pymongo`, `kafkapy`,
`azure-blob-py`, `grpcio` (+ `fetch`, `dom`).

Flow: the React Native client `fetch()`es Tornado routes; handlers persist
device metadata via peewee, raw readings via pymongo, publish onto a
`kafka-python` topic, and push firmware images to Azure Blob. A `grpcio`
servicer exposes aggregate statistics computed from the Mongo readings.

```
adorable analyze 11-sensor-hub
```
