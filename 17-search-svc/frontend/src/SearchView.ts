// Vue <script setup> component (.ts so the lang-ts pipeline walks it,
// matching tests/fixtures/vue). Searches documents and shows hits.
import { ref, onMounted, watch } from "vue";
import { searchDocs, indexDoc, type SearchHit } from "./api";

const query = ref<string>("");
const hits = ref<SearchHit[]>([]);
const title = ref<string>("");
const body = ref<string>("");

async function runSearch(): Promise<void> {
  hits.value = await searchDocs(query.value);
}

async function submitDoc(): Promise<void> {
  await indexDoc({ title: title.value, body: body.value });
  title.value = "";
  body.value = "";
  await runSearch();
}

onMounted(() => {
  void runSearch();
});

watch(query, () => {
  void runSearch();
});

export { query, hits, title, body, runSearch, submitDoc };
