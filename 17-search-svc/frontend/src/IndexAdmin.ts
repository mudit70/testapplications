// Vue <script setup> component for the indexer admin panel.
import { ref, onMounted, onUnmounted } from "vue";
import { rebuildIndex, indexStatus } from "./api";

const status = ref<string>("unknown");
const docs = ref<number>(0);
let timer: number | undefined;

async function refresh(): Promise<void> {
  const s = await indexStatus();
  status.value = s.status;
  docs.value = s.docs;
}

async function triggerRebuild(): Promise<void> {
  await rebuildIndex();
  await refresh();
}

onMounted(() => {
  void refresh();
  timer = window.setInterval(() => void refresh(), 5000);
});

onUnmounted(() => {
  if (timer) window.clearInterval(timer);
});

export { status, docs, refresh, triggerRebuild };
