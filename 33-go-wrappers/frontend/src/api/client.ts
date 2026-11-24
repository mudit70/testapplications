// Every call sends the signed-in user; the server's withUser reads it.
const headers = { 'X-User': localStorage.getItem('user') ?? '' };

export async function login(name: string) {
  const res = await fetch('/api/login', { method: 'POST', body: new URLSearchParams({ name }) });
  return res.json();
}

export async function listNotes() {
  const res = await fetch('/api/notes', { headers });
  return res.json();
}

export async function addNote(body: string) {
  await fetch('/api/notes', { method: 'POST', headers, body: new URLSearchParams({ body }) });
}

export async function deleteAttachment(id: string) {
  await fetch('/api/attachments', {
    method: 'DELETE',
    headers,
    body: new URLSearchParams({ id }),
  });
}

// Saving the settings also renews the session: two routes, one flow.
export async function saveSettings(color: string) {
  await fetch('/api/settings', { method: 'PUT', headers, body: new URLSearchParams({ color }) });
  await fetch('/api/renew', { method: 'POST', headers });
}
