<template>
  <table />
</template>

<script setup lang="ts">
import { onMounted } from "vue";

const loaders: Record<string, () => void> = {
  weekly: () => {
    void fetch("/api/reports?range=week");
  },
};

// Which loader runs is read when the code runs: not known.
const range = new URLSearchParams(location.search).get("range") ?? "weekly";
onMounted(loaders[range]);
</script>
