import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { ItemsService } from '@/client';

function getItemsQueryOptions() {
  return {
    queryFn: () => ItemsService.readItems(),
    queryKey: ['items'],
  };
}

export const Route = createFileRoute('/_layout/items')({ component: Items });

// Two components down from the route's own: still fetched as the page loads.
function ItemsTableContent() {
  const { data } = useSuspenseQuery(getItemsQueryOptions());
  return <ul>{String(data)}</ul>;
}

function ItemsTable() {
  return (
    <Suspense fallback={<p>Loading</p>}>
      <ItemsTableContent />
    </Suspense>
  );
}

function Items() {
  return (
    <section>
      <ItemsTable />
    </section>
  );
}
