/** Copies or moves the items: one PATCH per item, together. */
function moveCopy(items: string[], copy: boolean) {
  const promises = [];
  for (const item of items)
    promises.push(
      fetch(`/api/resources?from=${item}&action=${copy ? "copy" : "rename"}`, { method: "PATCH" }),
    );
  return Promise.all(promises);
}

export function move(items: string[]) {
  return moveCopy(items, false);
}

export function copy(items: string[]) {
  return moveCopy(items, true);
}
