<template>
  <nav>
    <button @click="toInbox">Inbox</button>
    <button @click="toDrafts">Drafts</button>
    <button @click="toSettings">Settings</button>
    <button @click="toReports">Reports</button>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const toInbox = () => router.push("/inbox");
const toDrafts = () => router.push("/drafts");
const toSettings = () => router.push("/settings");
const toReports = () => router.push("/reports");
</script>
