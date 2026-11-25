# 47-ts-then-watch

A Vue + Pinia front end (`web`) and its Express API (`api`), for veoagents #413 (filebrowser's
ListingItem drop and Share view).

- **Drop** (`components/Item.vue`): `const action = event.ctrlKey ? api.copy : api.move;
  action(items).then(() => { fileStore.reload = true; })`. The request is either function's
  PATCH, and the `.then` callback's only step is the store write that `views/Files.vue`'s
  watcher refetches the listing on.
- **Load share** (`views/Share.vue`): `fileStore.reload = false`. The watcher runs
  `newValue && fetchData()`, so a false write starts nothing: no edge to the watcher.

Answers are in `expected.yaml`, written from the code.
