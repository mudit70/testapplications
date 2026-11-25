<template>
  <ul />
</template>

<script setup lang="ts">
import { onActivated, onBeforeMount } from "vue";

function loadDrafts() {
  void fetch("/api/drafts");
}

function countDrafts() {
  void fetch("/api/drafts/count");
}

// Before it mounts, and each time a kept-alive view is shown again.
onBeforeMount(loadDrafts);
onActivated(countDrafts);
</script>
