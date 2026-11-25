<template>
  <ul />
</template>

<script setup lang="ts">
import { onMounted } from "vue";

const loadInbox = async () => {
  await fetch("/api/inbox");
};

// The hook is given the function by name.
onMounted(loadInbox);
</script>
