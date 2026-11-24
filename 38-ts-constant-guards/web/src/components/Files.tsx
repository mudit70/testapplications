import { checkConflict, post, publicShare } from "../api/files";

export function Files({ selected, dest, base }: { selected: string[]; dest: string; base: string }) {
  // Copy compares directories too (includeDirectories = true): only the destination's listing.
  const copy = async () => {
    await checkConflict(selected, dest, true);
  };
  // An upload may walk the destination's tree.
  const upload = async () => {
    await checkConflict(selected, dest);
  };
  // A folder's URL always ends in "/": the resources API, never tus.
  const newDir = async (name: string) => {
    let uri = base || "/";
    uri += `${encodeURIComponent(name)}/`;
    uri = uri.replace("//", "/");
    await post(uri);
  };
  // The public share page reads anonymously: no renew, no logout.
  const openShare = async () => {
    await publicShare("abc123");
  };
  return (
    <div>
      <button onClick={copy}>Copy</button>
      <button onClick={upload}>Upload</button>
      <button onClick={() => newDir("photos")}>New folder</button>
      <button onClick={openShare}>Open share</button>
    </div>
  );
}
