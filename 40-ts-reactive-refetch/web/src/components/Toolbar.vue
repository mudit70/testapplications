<template>
  <div>
    <button @click="copy">Copy</button>
    <button @click="cancel">Cancel</button>
    <button @click="refresh">Refresh</button>
    <button @click="retry">Retry</button>
    <button @click="nextPage">Next page</button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useFileStore } from "../stores/file";

const fileStore = useFileStore();
const { reload } = storeToRefs(fileStore);

/** Retries the listing through the store's ref. */
const retry = () => {
  reload.value = true;
};

/** The next page: the listing watches page. */
const nextPage = () => {
  fileStore.page++;
};

/** Copies, then has the listing fetch again (Files.vue watches reload). */
const copy = async () => {
  await fetch("/api/copy", { method: "POST" });
  fileStore.reload = true;
};

/** Has the store set reload itself (an options store's action). */
const refresh = () => fileStore.refresh();

/** Cancels: reload = false, which the listing's watcher skips. */
const cancel = async () => {
  await fetch("/api/cancel", { method: "POST" });
  fileStore.reload = false;
};
</script>
