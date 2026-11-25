<template>
  <button @click="copy">Copy</button>
</template>

<script lang="ts">
export default {
  props: ['dest'],
  methods: {
    // Copies, then goes to where the files went: a path only run time gives.
    async copy() {
      await fetch('/api/copy', { method: 'POST' });
      this.$router.push({ path: this.dest });
    },
  },
};
</script>
