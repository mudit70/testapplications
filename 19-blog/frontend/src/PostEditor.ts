// Vue <script setup> component for composing a new post and wiring a
// vanilla-DOM submit button (addEventListener → dom plugin).
import { ref } from "vue";
import { createPost, addComment } from "./api";

declare const document: {
  getElementById(id: string): HTMLElement;
};
interface HTMLElement {
  addEventListener(event: string, handler: (e?: Event) => void): void;
}
interface Event {
  preventDefault(): void;
}

const title = ref("");
const body = ref("");
const author = ref("");

export function mountEditor(): void {
  const submitButton = document.getElementById("submit-btn");

  // Vanilla DOM event handler — detected by the dom plugin.
  submitButton.addEventListener("click", () => {
    void createPost({
      title: title.value,
      body: body.value,
      author: author.value,
    });
  });

  const commentButton = document.getElementById("comment-btn");
  commentButton.addEventListener("click", () => {
    void addComment(1, { author: author.value, body: body.value });
  });
}

export { title, body, author };
