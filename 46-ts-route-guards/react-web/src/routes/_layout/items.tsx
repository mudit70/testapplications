import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/items')({ component: Items });

const readItems = async () => {
  const res = await fetch('/api/items');
  return res.json();
};

function Items() {
  const { data } = useQuery({ queryKey: ['items'], queryFn: readItems });
  return <ul>{String(data)}</ul>;
}
