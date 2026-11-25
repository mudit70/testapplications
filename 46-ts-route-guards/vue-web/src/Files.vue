<template>
  <div><Copy :dest="target" /></div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Copy from './Copy.vue';

// Where a copy goes: what the user picks, at run time.
const target = ref(window.location.hash.slice(1));
</script>
