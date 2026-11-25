export const ItemsService = {
  readItems: () => fetch('/api/items').then((r) => r.json()),
  createItem: (title: string) =>
    fetch('/api/items', { method: 'POST', body: JSON.stringify({ title }) }),
};

export const UsersService = {
  readUsers: () => fetch('/api/users').then((r) => r.json()),
};

export function reportError(message: string) {
  void fetch('/api/errors', { method: 'POST', body: message });
}

// A mutation's onError, bound to what it reports for.
export function handleError(this: string, err: Error) {
  reportError(`${this}: ${err.message}`);
}

// Success handlers made by a factory: each call gives the callback a mutation runs.
export const createHandlers = () => ({
  onCreated: (what: string) => () => {
    void fetch('/api/audit', { method: 'POST', body: what });
  },
});
