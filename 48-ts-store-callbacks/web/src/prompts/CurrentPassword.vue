<template>
  <form @submit="submit"><input v-model="password" /></form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useLayoutStore } from "../stores/layout";

const layoutStore = useLayoutStore();
const { currentPrompt } = layoutStore;
const password = ref("");

const submit = (event: Event) => {
  event.preventDefault();
  currentPrompt?.confirm(password.value);
};
</script>
