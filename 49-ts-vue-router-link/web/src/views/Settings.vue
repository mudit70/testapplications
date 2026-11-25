<template>
  <form />
</template>

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  void fetch("/api/settings");
});
</script>
