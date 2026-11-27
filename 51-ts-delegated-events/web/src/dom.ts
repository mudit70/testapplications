/** Runs fn for an event on root whose target is inside an element the selector picks. */
export function registerForEvent(
  root: HTMLElement,
  selector: string,
  event: string,
  fn: (e: Event) => void,
) {
  root.addEventListener(event, (e) => {
    if ((e.target as HTMLElement).closest(selector)) fn(e);
  });
}
