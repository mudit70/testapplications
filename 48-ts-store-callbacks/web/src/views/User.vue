<template>
  <button @click="deletePrompt">Delete account</button>
  <button @click="save">Save</button>
</template>

<script setup lang="ts">
import { useLayoutStore } from "../stores/layout";

const layoutStore = useLayoutStore();

// Two openers: delete-user's confirm removes the user; current-password's saves it.
const deletePrompt = () => {
  layoutStore.showHover({
    prompt: "delete-user",
    confirm: () => {
      void fetch("/api/users/1", { method: "DELETE" });
    },
  });
};

const save = () => {
  layoutStore.showHover({
    prompt: "current-password",
    confirm: (password: string) => {
      void fetch("/api/users/1", { method: "PUT", body: password });
    },
  });
};
</script>
