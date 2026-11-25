import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import useAuth from '@/hooks/useAuth';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
  const { user, logout } = useAuth();
  const addItem = useMutation({
    mutationFn: () => fetch('/api/items', { method: 'POST' }),
  });

  return (
    <div>
      <p>{String(user)}</p>
      <button onClick={() => addItem.mutate()}>Add item</button>
      <button onClick={() => logout()}>Log out</button>
    </div>
  );
}
