// A request wrapper that carries the HTTP method: each caller's method and path are the request.
export function request(method: string, path: string, body?: unknown) {
  return fetch(path, {
    method,
    headers: { 'content-type': 'application/json', authorization: localStorage.token ?? '' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
