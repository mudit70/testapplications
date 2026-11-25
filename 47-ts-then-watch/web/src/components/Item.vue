<template>
  <div draggable="true" @drop="drop">{{ name }}</div>
</template>

<script setup lang="ts">
import * as api from "../api/files";
import { useFileStore } from "../stores/file";

const props = defineProps<{ name: string }>();
const fileStore = useFileStore();

const showError = (e: unknown) => console.error(e);

// Dropped with Ctrl held, the items are copied; otherwise moved. Either way the listing reloads.
const drop = (event: DragEvent) => {
  const action = event.ctrlKey ? api.copy : api.move;
  action([props.name])
    .then(() => {
      fileStore.reload = true;
    })
    .catch(showError);
};
</script>
