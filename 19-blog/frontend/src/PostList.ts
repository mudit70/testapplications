// Vue <script setup> component (.ts so the lang-ts pipeline walks it,
// matching tests/fixtures/vue). Lists posts and refreshes them.
import { ref, onMounted, onUnmounted, watch } from "vue";
import { fetchPosts, deletePost, type Post } from "./api";

const posts = ref<Post[]>([]);
const selected = ref<number | null>(null);

async function loadPosts(): Promise<void> {
  posts.value = await fetchPosts();
}

async function removePost(id: number): Promise<void> {
  await deletePost(id);
  await loadPosts();
}

onMounted(() => {
  void loadPosts();
});

onUnmounted(() => {
  posts.value = [];
});

watch(selected, () => {
  console.log("selected post changed:", selected.value);
});

export { posts, selected, loadPosts, removePost };
