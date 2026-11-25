<template>
  <div>
    <header><button @click="out">Log out</button></header>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { logout } from '@/utils/auth';

const out = () => logout();
</script>
