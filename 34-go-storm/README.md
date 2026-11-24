# 34-go-storm — BoltDB through storm (React + net/http + storm)

A written fixture for veoagents: its answers are in `expected.yaml`, written from the code. The
store (`backend/store/store.go`) is shaped like filebrowser's `storage/bolt`: storm keeps each
struct in a bucket named after its type, and a key-value bucket holds the per-user theme.

| UI action | Request | Data |
| --- | --- | --- |
| Load bookmarks | GET /api/bookmarks | `One("Name", …, &User)` reads User; `Select(q.Eq(…)).Find(&list)` reads Bookmark |
| Add bookmark | POST /api/bookmarks | reads User; `Save(&Bookmark)` writes Bookmark |
| Remove bookmark | DELETE /api/bookmarks/{id} | `DeleteStruct(&Bookmark{…})` writes Bookmark |
| Load theme | GET /api/theme | `Get("settings", …)` reads settings |
| Save theme | PUT /api/theme | `Set("settings", …)` writes settings |
| Share with team | POST /api/team/bookmarks | `From("team").Save(&b)` writes team/Bookmark, the Bookmark bucket below the team bucket |
| Load archive | GET /api/archive | `Select(…).Bucket("archive").Find(&list)` reads archive |
