import { defineStore } from "pinia";
import { postResources } from "../api/files";

/** A queue of uploads (a Pinia setup store): each one goes through the resources API. */
export const useUploadStore = defineStore("upload", () => {
  const pending: string[] = [];
  const upload = async (path: string, file: Blob) => {
    pending.push(path);
    await postResources(path, file, () => {});
    pending.splice(pending.indexOf(path), 1);
  };
  return { pending, upload };
});
