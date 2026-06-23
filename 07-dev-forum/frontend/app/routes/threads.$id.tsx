import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useThreadStore } from '../store/threads.store.js';

export async function loader({ params }: LoaderFunctionArgs) {
  const res = await fetch(`/api/threads/${params.id}`);
  const thread = await res.json();
  return json(thread);
}

export default function ThreadDetailPage() {
  const thread = useLoaderData<typeof loader>();
  const deleteThread = useThreadStore((s) => s.deleteThread);
  return (
    <div>
      <h2>{thread.title}</h2>
      <p>{thread.body}</p>
      <button onClick={() => deleteThread(thread.id)}>Delete</button>
    </div>
  );
}
