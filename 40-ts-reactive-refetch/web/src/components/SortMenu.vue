<template>
  <select @change="bySize">
    <option>size</option>
  </select>
</template>

<script lang="ts">
import { mapWritableState } from "pinia";
import { useFileStore } from "../stores/file";

export default {
  name: "sort-menu",
  computed: {
    ...mapWritableState(useFileStore, ["sort"]),
  },
  methods: {
    // Changing sort makes the listing fetch again (Files.vue watches () => fileStore.sort).
    bySize() {
      this.sort = "size";
    },
  },
};
</script>
