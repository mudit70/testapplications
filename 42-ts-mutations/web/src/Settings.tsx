import { useTransition } from 'react';

export function Settings() {
  const [isPending, startTransition] = useTransition();

  // The request is made inside the transition React runs at once.
  function save() {
    if (isPending) return;
    startTransition(async () => {
      await fetch('/api/settings', { method: 'POST' });
    });
  }

  return <button onClick={save}>Save settings</button>;
}
