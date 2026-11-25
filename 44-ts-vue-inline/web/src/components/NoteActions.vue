<template>
  <div>
    <button @click="notesStore.refresh()">Refresh</button>
    <button @click="notesApi.pin(note.id); notesStore.refresh()">Pin</button>
    <button @click="() => removeNote(note.id)">Delete</button>
    <button @click.stop="share(note.id)">Share</button>
    <button @click="open = !open">Toggle</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { notesApi, removeNote } from "../api";
import { useNotesStore } from "../stores/notes";

const props = defineProps<{ note: { id: string } }>();
const note = props.note;
const notesStore = useNotesStore();
const open = ref(false);

/** Shares the note, then shows the listing again. */
const share = async (id: string) => {
  await notesApi.share(id);
  await notesStore.refresh();
};
</script>
