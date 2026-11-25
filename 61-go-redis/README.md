# 61-go-redis — a redis upload cache's keys as data (React + net/http + go-redis)

A written fixture for veoagents (#353): its answers are in `expected.yaml`, written from the code.
Shaped like filebrowser's `http/upload_cache_redis.go`. The upload handlers keep each upload's
length in an upload cache, chosen at run time: a map in memory, or redis through go-redis under
`uploads:length:<path>`. The redis cache's key family is `uploads:length:{filePath}`.

| UI action | Requests | Data |
| --- | --- | --- |
| Start | POST /api/uploads/{path} | writes uploads:length:{filePath} (Set) |
| Resume | GET /api/uploads/{path} | reads uploads:length:{filePath} (Get), writes it (Expire) |
| Cancel | DELETE /api/uploads/{path} | writes uploads:length:{filePath} (Del) |
