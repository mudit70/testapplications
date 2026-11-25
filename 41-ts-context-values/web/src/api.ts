// The app's own API, called by its public address (as realworld's front end calls conduit).
const API_ROOT = "https://api.shelf.example/api";

export const listItems = () => fetch(`${API_ROOT}/items`).then((r) => r.json());

export const createItem = (name: string) =>
  fetch(`${API_ROOT}/items`, { method: "POST", body: JSON.stringify({ name }) });

export const removeItem = (id: string) => fetch(`${API_ROOT}/items/${id}`, { method: "DELETE" });

export const me = () => fetch(`${API_ROOT}/me`).then((r) => r.json());
