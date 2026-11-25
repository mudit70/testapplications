<template>
  <button @click="submit">Delete</button>
</template>

<script lang="ts">
import { mapState } from "pinia";
import { useLayoutStore } from "../stores/layout";

export default {
  computed: {
    ...mapState(useLayoutStore, ["currentPrompt"]),
  },
  methods: {
    submit: function () {
      this.currentPrompt?.confirm();
    },
  },
};
</script>
