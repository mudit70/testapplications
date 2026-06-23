// F6 fe-wrapper-dynamic rung: a generic request wrapper where the URL is the
// PARAMETER (dynamic). The free-function wrapper itself emits a `dynamic`
// caller; each call site substitutes the literal argument.
export function request(path: string, options?: RequestInit) {
  return fetch(path, options);
}
