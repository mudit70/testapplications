<template>
  <nav>
    <router-link to="/settings">Settings</router-link>
    <RouterLink :to="'/users/' + userId">Profile</RouterLink>
    <router-link :to="{ name: 'Files' }">Files</router-link>
    <router-link :to="lastVisited">Back</router-link>
  </nav>
</template>

<script setup lang="ts">
const userId = 7;
// Where the user was last: read when the code runs.
const lastVisited = sessionStorage.getItem("lastVisited") ?? "/";
</script>
