<template>
  <ul />
</template>

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  void fetch("/api/resources");
});
</script>
