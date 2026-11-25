<template>
  <form @submit="submit">
    <input v-model="username" />
    <input v-model="password" type="password" />
    <button type="submit">Sign in</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { login } from '@/utils/auth';

const route = useRoute();
const router = useRouter();
const username = ref('');
const password = ref('');

const submit = async (event: Event) => {
  event.preventDefault();
  // Where the guard sent the user from, else the file list.
  const redirect = (route.query.redirect || '/files/') as string;
  await login(username.value, password.value);
  router.push({ path: redirect });
};
</script>
