<template>
  <ul>
    <li v-for="item in items" :key="item">{{ item }}</li>
  </ul>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const items = ref<string[]>([]);

const fetchData = async () => {
  const res = await fetch('/api/resources');
  items.value = (await res.json()).items;
};

onMounted(() => {
  fetchData();
});
</script>
