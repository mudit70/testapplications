import { defineStore } from "pinia";

/** The listing's state: setting reload (or changing sort) makes the listing fetch again. */
export const useFileStore = defineStore("file", {
  state: () => ({ reload: false, sort: "name" }),
  actions: {
    refresh() {
      this.reload = true;
    },
  },
});
