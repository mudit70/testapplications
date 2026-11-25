/** The notes API's calls, as an object of functions. */
export const notesApi = {
  pin: (id: string) => fetch(`/api/notes/${id}/pin`, { method: "POST" }),
  share: (id: string) => fetch(`/api/notes/${id}/share`, { method: "POST" }),
};

export function removeNote(id: string) {
  return fetch(`/api/notes/${id}`, { method: "DELETE" });
}
