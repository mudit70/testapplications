import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { createHandlers, handleError, ItemsService, UsersService } from './api';

function ItemsTable() {
  const { data } = useQuery({
    queryKey: ['items', { page: 1 }],
    queryFn: () => ItemsService.readItems(),
  });
  return <ul>{String(data)}</ul>;
}

// Another query on the same screen: the items invalidation does not refetch it.
function UsersTable() {
  const { data } = useQuery({ queryKey: ['users'], queryFn: UsersService.readUsers });
  return <ul>{String(data)}</ul>;
}

function AddItem() {
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();
  const { onCreated } = createHandlers();
  const mutation = useMutation({
    mutationFn: (t: string) => ItemsService.createItem(t),
    onSuccess: onCreated('item'),
    onError: handleError.bind('add item'),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
  return (
    <div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button onClick={() => mutation.mutate(title)}>Add</button>
    </div>
  );
}

export function Items() {
  return (
    <section>
      <AddItem />
      <ItemsTable />
      <UsersTable />
    </section>
  );
}
