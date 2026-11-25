import { defineStore } from "pinia";

interface PopupProps {
  prompt: string;
  confirm?: ((...args: any[]) => unknown) | null;
}

/** The open prompts: each opener hands over what its prompt's confirm button does. */
export const useLayoutStore = defineStore("layout", {
  state: (): { prompts: PopupProps[] } => ({ prompts: [] }),
  getters: {
    currentPrompt(state) {
      return state.prompts.length > 0 ? state.prompts[state.prompts.length - 1] : null;
    },
  },
  actions: {
    showHover(value: PopupProps | string) {
      if (typeof value !== "object") {
        this.prompts.push({ prompt: value, confirm: null });
        return;
      }
      this.prompts.push({ prompt: value.prompt, confirm: value?.confirm });
    },
    closeHovers() {
      this.prompts.pop();
    },
  },
});
