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

// Before it mounts; onActivated runs only for a page KeepAlive keeps, which none does here.
onBeforeMount(loadDrafts);
onActivated(countDrafts);
</script>
