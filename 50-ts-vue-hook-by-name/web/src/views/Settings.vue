<template>
  <form />
</template>

<script lang="ts">
import { loadFolders } from "../folders";

export default {
  // The options API: created given a function by reference, mounted a method.
  created: loadFolders,
  mounted() {
    void fetch("/api/settings");
  },
};
</script>
