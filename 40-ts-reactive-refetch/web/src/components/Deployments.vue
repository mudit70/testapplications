<template>
  <div>
    <button @click="redeploy">Redeploy</button>
    <button @click="refetch">Refresh deployments</button>
  </div>
</template>

<script setup lang="ts">
import { collection } from "../collections";
import { queryClient } from "../collections/deployments";

const props = defineProps<{ projectId: string; deploymentId: string }>();

/** Redeploys, then invalidates the project's deployments: the collection loads them again. */
const redeploy = async () => {
  await fetch(`/api/deployments/${props.deploymentId}/redeploy`, { method: "POST" });
  await queryClient.invalidateQueries({ queryKey: ["deployments", props.projectId] });
};

/** Refetches the collection itself. */
const refetch = () => {
  collection.deployments.utils.refetch();
};
</script>
