# 39-ts-xhr-tus — XMLHttpRequest, tus-js-client and a rebuilt URL

A written fixture for veoagents: its answers are in `expected.yaml`, written from the code. The
request shapes filebrowser's front end uses (veoagents #386).

| UI action (`web/src/components/Drive.tsx`) | Request | Reaches |
| --- | --- | --- |
| New file | `new XMLHttpRequest()`, `open("POST", url)`, `send(content)` | POST /api/resources/{*} |
| Upload | `new tus.Upload(file, { endpoint })`, `upload.start()` | POST /api/tus/{*}, then PATCH /api/tus/{*} |
| Share | `url = url.replace(…); url = \`/api/share${url}\`; fetch(url)` | POST /api/share/{*} |
| Queue upload | `useUploadStore().upload(path, file)`, a Pinia setup store's action | POST /api/resources/{*} |
