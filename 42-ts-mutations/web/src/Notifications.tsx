import { useMutation, useQuery } from '@tanstack/react-query';

const listNotifiers = () => fetch('/api/notifications').then((r) => r.json());

export function Notifications() {
  const { data, refetch } = useQuery({ queryKey: ['notifiers'], queryFn: listNotifiers });
  const create = useMutation({
    mutationFn: () => fetch('/api/notifications', { method: 'POST' }),
    // The list is fetched again once the new notifier is saved.
    onSuccess: () => refetch(),
  });
  return (
    <div>
      <p>{String(data)}</p>
      <button onClick={() => create.mutate()}>New notifier</button>
    </div>
  );
}
