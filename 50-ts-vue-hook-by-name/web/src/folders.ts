/** Loads the folder list; a settings page reuses it as its created hook. */
export function loadFolders() {
  void fetch("/api/folders");
}
