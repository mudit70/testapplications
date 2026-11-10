'use client';
import { useState } from 'react';
import { api } from '~/lib/trpc';

export function PollList() {
  const polls = api.polls.list.useQuery();
  const create = api.polls.create.useMutation();
  const utils = api.useUtils();
  const [title, setTitle] = useState('');

  // A click that runs a mutation, then refetches the list.
  async function onCreate() {
    await create.mutateAsync({ title });
    await utils.polls.list.fetch();
  }

  return (
    <div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button onClick={onCreate}>Create poll</button>
      <ul>{polls.data?.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
    </div>
  );
}
