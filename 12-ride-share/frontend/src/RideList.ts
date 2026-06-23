// Vue <script setup> component (.ts so the lang-ts pipeline walks it,
// matching tests/fixtures/vue). Lists rides and refreshes them.
import { ref, onMounted, onUnmounted, watch } from "vue";
import { fetchRides, completeRide, type Ride } from "./api";

const rides = ref<Ride[]>([]);
const selected = ref<number | null>(null);

async function loadRides(): Promise<void> {
  rides.value = await fetchRides();
}

async function finish(id: number): Promise<void> {
  await completeRide(id);
  await loadRides();
}

onMounted(() => {
  void loadRides();
});

onUnmounted(() => {
  rides.value = [];
});

watch(selected, () => {
  console.log("selected ride changed:", selected.value);
});

export { rides, selected, loadRides, finish };
