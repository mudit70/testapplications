<template>
  <header>
    <button @click="reload()">Reload</button>
    <button @click="() => (compact = !compact)">Compact</button>
  </header>
</template>

<script lang="ts">
import { mapActions } from "pinia";
import { useNotesStore } from "../stores/notes";

/** An Options API component: the store's action, mapped into its methods as reload. */
export default {
  name: "notes-header",
  data: () => ({ compact: false }),
  methods: {
    ...mapActions(useNotesStore, { reload: "refresh" }),
  },
};
</script>
