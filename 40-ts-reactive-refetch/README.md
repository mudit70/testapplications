# 40-ts-reactive-refetch — refetches through reactive state

A written fixture for veoagents: its answers are in `expected.yaml`, written from the code. Each
UI action changes state that something else watches or loads by, and that makes a request
(veoagents #387, from filebrowser's file store and unkey's deployments collection).

| UI action | What it changes | Requests |
| --- | --- | --- |
| Copy (`Toolbar.vue`) | `fileStore.reload = true`; `Files.vue` watches `reload` through `storeToRefs` and runs `fetchData` when it is true | POST /api/copy, GET /api/resources |
| Cancel (`Toolbar.vue`) | `fileStore.reload = false`, which the watcher's `newValue && fetchData()` skips | POST /api/cancel |
| Refresh (`Toolbar.vue`) | `fileStore.refresh()`, an options store action that sets `this.reload = true` | GET /api/resources |
| Retry (`Toolbar.vue`) | `reload.value = true` on the ref `storeToRefs(fileStore)` gives | GET /api/resources |
| Next page (`Toolbar.vue`) | `fileStore.page++`; `Files.vue` watches `() => fileStore.page` | GET /api/resources |
| Sort by size (`SortMenu.vue`) | `this.sort = "size"` through `mapWritableState`; `Files.vue` watches `() => fileStore.sort` | GET /api/resources |
| Redeploy (`Deployments.vue`) | `queryClient.invalidateQueries({ queryKey: ["deployments", projectId] })`, the key the deployments collection loads by | POST /api/deployments/{id}/redeploy, GET /api/deployments |
| Refresh deployments (`Deployments.vue`) | `collection.deployments.utils.refetch()` | GET /api/deployments |
