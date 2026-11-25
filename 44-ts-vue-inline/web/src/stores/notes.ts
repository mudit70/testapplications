import { defineStore } from "pinia";

/** The notes listing: refresh loads it again. */
export const useNotesStore = defineStore("notes", {
  state: () => ({ notes: [] as string[] }),
  actions: {
    async refresh() {
      const res = await fetch("/api/notes");
      this.notes = await res.json();
    },
  },
});
