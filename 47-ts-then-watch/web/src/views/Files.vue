<template>
  <ul>
    <li v-for="item in items" :key="item">{{ item }}</li>
  </ul>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useFileStore } from "../stores/file";

const fileStore = useFileStore();
const { reload } = storeToRefs(fileStore);
const items = ref<string[]>([]);

const fetchData = async () => {
  fileStore.reload = false;
  const res = await fetch("/api/resources");
  items.value = await res.json();
};

watch(reload, (newValue) => {
  newValue && fetchData();
});
</script>
