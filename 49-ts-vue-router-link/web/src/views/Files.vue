<template>
  <ul>
    <router-link to="/files/docs">Docs</router-link>
  </ul>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const fetchData = async () => {
  await fetch(`/api/resources?path=${route.params.path}`);
};

onMounted(() => {
  fetchData();
});
// Another folder keeps this page mounted: the listing fetches again as the route changes.
watch(route, () => {
  fetchData();
});
</script>
