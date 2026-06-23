// Vue <script setup> component (.ts so the lang-ts pipeline walks it,
// matching tests/fixtures/vue). Lists polls and refreshes them.
import { ref, onMounted, onUnmounted, watch } from "vue";
import { fetchPolls, type Poll } from "./api";

const polls = ref<Poll[]>([]);
const selected = ref<number | null>(null);

async function loadPolls(): Promise<void> {
  polls.value = await fetchPolls();
}

onMounted(() => {
  void loadPolls();
});

onUnmounted(() => {
  polls.value = [];
});

watch(selected, () => {
  console.log("selected poll changed:", selected.value);
});

export { polls, selected, loadPolls };
