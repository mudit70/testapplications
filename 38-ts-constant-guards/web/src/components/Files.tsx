import { checkConflict, listEntries, post, publicShare } from "../api/files";

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
  // Move lists the destination with { recursive: false }: no walk.
  const move = async () => {
    await listEntries({ base: dest, recursive: false });
  };
  // A loop that changes the URL after each request: its end is not sure, both branches stay.
  const newDirs = async (names: string[]) => {
    let uri = "/";
    for (const name of names) {
      await post(uri);
      uri = uri + encodeURIComponent(name);
    }
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
      <button onClick={move}>Move</button>
      <button onClick={() => newDirs(["a", "b"])}>New folders</button>
    </div>
  );
}
