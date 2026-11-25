<template>
  <button @click="fetchData">Load</button>
</template>

<script setup lang="ts">
import { useFileStore } from "../stores/file";

const fileStore = useFileStore();

// Resets the listing's flag to false, a value its watcher skips: no listing fetch.
const fetchData = async () => {
  fileStore.reload = false;
  await fetch("/api/share");
};
</script>
