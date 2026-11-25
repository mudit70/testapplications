# 50-ts-vue-hook-by-name

A Vue front end (`web`) on vue-router and its Express API (`api`), for veoagents #449. Each page
gives its lifecycle hooks their work by name rather than inline:

- `views/Inbox.vue`: `onMounted(loadInbox)`.
- `views/Drafts.vue`: `onBeforeMount(loadDrafts)` and `onActivated(countDrafts)`, two
  function declarations.
- `views/Settings.vue`: the options API, with `created: loadFolders` (imported from `folders.ts`)
  beside a `mounted()` method.
- `views/Reports.vue`: `onMounted(loaders[range])`, a loader picked at run time. Which one runs is
  a `handler_target` Unknown.

Home's buttons navigate to each page with `router.push`. Answers are in `expected.yaml`, written
from the code.
