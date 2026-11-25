# 44-ts-vue-inline — Vue template handlers written as inline expressions

A written fixture for veoagents: its answers are in `expected.yaml`, written from the code. Vue
runs an inline handler's expression as the handler, so the functions it calls handle the event
(veoagents #401, found while writing 40-ts-reactive-refetch).

| UI action (`web/src/components/NoteActions.vue` unless named) | Handler | Requests |
| --- | --- | --- |
| Refresh | `@click="notesStore.refresh()"`, a Pinia options store's action | GET /api/notes |
| Pin | `@click="notesApi.pin(note.id); notesStore.refresh()"`, a function of an imported object, then the store's action | POST /api/notes/{id}/pin, GET /api/notes |
| Delete | `@click="() => removeNote(note.id)"`, an arrow calling an imported function | DELETE /api/notes/{id} |
| Share | `@click.stop="share(note.id)"`, the script's function, with a modifier | POST /api/notes/{id}/share, GET /api/notes |
| Toggle | `@click="open = !open"`, state only | none |
| Reload (`NotesHeader.vue`) | `@click="reload()"`, the store's `refresh` mapped into an Options API component's methods (`mapActions(useNotesStore, { reload: "refresh" })`) | GET /api/notes |
| Compact (`NotesHeader.vue`) | `@click="() => (compact = !compact)"`, state only | none |
