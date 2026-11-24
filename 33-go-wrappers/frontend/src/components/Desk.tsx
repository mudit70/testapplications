import React, { useState } from 'react';
import { addNote, deleteAttachment, listNotes, login, saveSettings } from '../api/client';

export default function Desk() {
  const [notes, setNotes] = useState<unknown[]>([]);

  return (
    <div>
      <button onClick={() => login('me')}>Sign in</button>
      <button onClick={async () => setNotes(await listNotes())}>Load notes</button>
      <button onClick={() => addNote('hello')}>Add note</button>
      <button onClick={() => deleteAttachment('1')}>Delete attachment</button>
      <button onClick={() => saveSettings('#336699')}>Save settings</button>
      <pre>{JSON.stringify(notes)}</pre>
    </div>
  );
}
