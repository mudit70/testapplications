// Vue <script setup> component — create a poll and search polls.
import { ref, watchEffect } from "vue";
import { createPoll, searchPolls } from "./api";

const question = ref("");
const options = ref<string[]>(["", ""]);
const query = ref("");
const results = ref<unknown>(null);

async function submit(): Promise<void> {
  await createPoll({
    question: question.value,
    options: options.value,
    created_by: 1,
  });
  question.value = "";
}

watchEffect(() => {
  if (query.value) {
    void searchPolls(query.value).then((r) => {
      results.value = r;
    });
  }
});

export { question, options, query, results, submit };
