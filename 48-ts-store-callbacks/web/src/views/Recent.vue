<template>
  <button @click="reopen">Reopen</button>
</template>

<script setup lang="ts">
import { useLayoutStore } from "../stores/layout";

const layoutStore = useLayoutStore();

// Reopens the last prompt by a name read when the code runs: which prompt shows it is not known.
const reopen = () => {
  const name = localStorage.getItem("lastPrompt") ?? "";
  layoutStore.showHover({
    prompt: name,
    confirm: () => {
      void fetch("/api/share/abc", { method: "DELETE" });
    },
  });
};
</script>
