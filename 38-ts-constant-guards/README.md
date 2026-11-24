# 38-ts-constant-guards — branches a constant argument rules out

A written fixture for veoagents: its answers are in `expected.yaml`, written from the code. Each
UI action calls a request helper with a constant that decides which of the helper's branches
run (veoagents #388, from filebrowser's checkConflict, post and pub.fetch).

| UI action (`web/src/components/Files.tsx`) | Call | Requests |
| --- | --- | --- |
| Copy | `checkConflict(selected, dest, true)`: `recursive = !includeDirectories && …` is false | the destination's listing only |
| Upload | `checkConflict(selected, dest)` | the recursive walk, or the listing |
| New folder | `post(uri)`, `uri` built to end in `/`: `viaResources = url.endsWith("/") || …` | the resources API, not tus |
| Move | `listEntries({ base: dest, recursive: false })` | the listing only |
| New folders | `post(uri)` in a loop that then changes `uri` | either branch |
| Open share | `fetchURL(url, {}, false)`: `if (auth && …) renew()` | the share, no renew |

Every request through `fetchURL` with auth may renew the token (POST /api/renew).
