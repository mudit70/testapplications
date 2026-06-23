import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useThreadStore } from '../store/threads.store.js';

export async function loader(_args: LoaderFunctionArgs) {
  const res = await fetch('/api/threads');
  const threads = await res.json();
  return json(threads);
}

export default function IndexPage() {
  const threads = useLoaderData<typeof loader>();
  const createThread = useThreadStore((s) => s.createThread);
  return (
    <div>
      <h1>Threads</h1>
      <button onClick={() => createThread('New', 'Body')}>New thread</button>
      <ul>
        {threads.map((t: { id: string; title: string }) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </div>
  );
}
