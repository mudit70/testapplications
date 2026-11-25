import { defineStore } from "pinia";

/** The listing's state: setting reload to true makes the listing fetch again. */
export const useFileStore = defineStore("file", {
  state: () => ({ reload: false }),
});
