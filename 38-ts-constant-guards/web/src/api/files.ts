import { fetchURL } from "./utils";

/** The destination's entries: its whole tree, or its own listing. */
async function fetchEntries(base: string, recursive: boolean) {
  return recursive
    ? fetchURL(`/resources/recursive${base}`)
    : fetchURL(`/resources${base}`);
}

/**
 * The names a transfer would overwrite. Copy and move compare directories too, and need only
 * the destination's own listing; an upload of nested files walks the tree.
 */
export async function checkConflict(files: string[], base: string, includeDirectories = false) {
  const recursive = !includeDirectories && files.some((f) => f.includes("/"));
  const res = await fetchEntries(base, recursive);
  const names = (await res.json()) as string[];
  return files.filter((f) => names.includes(f));
}

/** Creates a folder (a URL ending in "/") or a file, through the resources API or tus. */
export async function post(url: string, content = "") {
  const viaResources = url.endsWith("/") || content === "";
  return viaResources
    ? fetchURL(`/resources${url}`, { method: "POST", body: content })
    : fetchURL(`/tus${url}`, { method: "POST", body: content });
}

/** A public share, read without a session. */
export async function publicShare(hash: string) {
  const res = await fetchURL(`/public/share/${hash}`, {}, false);
  return res.json();
}
