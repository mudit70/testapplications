<template>
  <component :is="modal" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useLayoutStore } from "../stores/layout";
import ShareDelete from "./ShareDelete.vue";
import DeleteUser from "./DeleteUser.vue";
import CurrentPassword from "./CurrentPassword.vue";

const layoutStore = useLayoutStore();
const { currentPrompt } = storeToRefs(layoutStore);

// Which prompt shows for the name the opener gave.
const components = new Map<string, any>([
  ["share-delete", ShareDelete],
  ["delete-user", DeleteUser],
  ["current-password", CurrentPassword],
]);

const modal = computed(() => components.get(currentPrompt.value?.prompt ?? ""));
</script>
