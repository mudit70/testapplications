<template>
  <button @click="layoutStore.currentPrompt?.confirm">Delete</button>
</template>

<script setup lang="ts">
import { useLayoutStore } from "../stores/layout";

const layoutStore = useLayoutStore();
</script>
