<template>
  <section />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

onMounted(() => {
  void fetch(`/api/users/${route.params.id}`);
});
</script>
