import React, { useState } from 'react';

const headers = { 'X-User': 'me' };

export default function Bookmarks() {
  const [list, setList] = useState<unknown[]>([]);
  const [theme, setTheme] = useState('');

  const load = async () => {
    const res = await fetch('/api/bookmarks', { headers });
    setList(await res.json());
  };

  const add = async () => {
    await fetch('/api/bookmarks', {
      method: 'POST',
      headers,
      body: new URLSearchParams({ url: 'https://example.org' }),
    });
  };

  const remove = async (id: number) => {
    await fetch(`/api/bookmarks/${id}`, { method: 'DELETE', headers });
  };

  const loadTheme = async () => {
    const res = await fetch('/api/theme', { headers });
    setTheme(await res.text());
  };

  const saveTheme = async () => {
    await fetch('/api/theme', {
      method: 'PUT',
      headers,
      body: new URLSearchParams({ theme: 'dark' }),
    });
  };

  return (
    <div>
      <button onClick={load}>Load bookmarks</button>
      <button onClick={add}>Add bookmark</button>
      <button onClick={() => remove(1)}>Remove bookmark</button>
      <button onClick={loadTheme}>Load theme</button>
      <button onClick={saveTheme}>Save theme</button>
      <pre>{JSON.stringify({ list, theme })}</pre>
    </div>
  );
}
