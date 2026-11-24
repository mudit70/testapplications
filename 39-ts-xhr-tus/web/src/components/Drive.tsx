import { createShare, postResources, uploadTus } from "../api/files";
import { useUploadStore } from "../stores/upload";

export function Drive({ file }: { file: Blob }) {
  const newFile = async () => {
    await postResources("/notes.txt", file, () => {});
  };
  const upload = async () => {
    await uploadTus("/backup.iso", file);
  };
  // Queued through a Pinia store's action.
  const queue = async () => {
    const uploadStore = useUploadStore();
    await uploadStore.upload("/queued.bin", file);
  };
  const share = async () => {
    await createShare("/files/report.pdf", "24");
  };
  return (
    <div>
      <button onClick={newFile}>New file</button>
      <button onClick={upload}>Upload</button>
      <button onClick={share}>Share</button>
      <button onClick={queue}>Queue upload</button>
    </div>
  );
}
