// Vue <script setup> component for requesting a ride and viewing drivers.
import { ref, onMounted, watchEffect } from "vue";
import { requestRide, fetchDrivers, type Driver } from "./api";

const origin = ref("");
const dest = ref("");
const drivers = ref<Driver[]>([]);

async function loadDrivers(): Promise<void> {
  drivers.value = await fetchDrivers();
}

async function submit(): Promise<void> {
  await requestRide({ rider_id: 1, origin: origin.value, dest: dest.value });
  origin.value = "";
  dest.value = "";
}

onMounted(() => {
  void loadDrivers();
});

watchEffect(() => {
  console.log("available drivers:", drivers.value.length);
});

export { origin, dest, drivers, submit, loadDrivers };
