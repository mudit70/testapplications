<template>
  <button @click="deleteLink">Delete link</button>
</template>

<script setup lang="ts">
import { useLayoutStore } from "../stores/layout";

const layoutStore = useLayoutStore();

// Opens the share-delete prompt; its confirm button removes the share.
const deleteLink = () => {
  layoutStore.showHover({
    prompt: "share-delete",
    confirm: () => {
      layoutStore.closeHovers();
      void fetch("/api/share/abc", { method: "DELETE" });
    },
  });
};
</script>
