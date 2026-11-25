# 42-ts-mutations — what runs around a TanStack Query mutation

A written fixture for veoagents (#385): its answers are in `expected.yaml`, written from the code.

| UI action | Shape | Reaches |
| --- | --- | --- |
| Add item | `useMutation` with `onSuccess: onCreated('item')` (a factory's callback), `onError: handleError.bind('add item')`, and `onSettled` invalidating `['items']`; the QueryClient's `MutationCache` onError | POST /api/items, POST /api/audit, POST /api/errors, GET /api/items (ItemsTable's `['items', { page: 1 }]`; UsersTable's `['users']` is not refetched) |
| New notifier | `onSuccess: () => refetch()` of the component's own query | POST /api/notifications, GET /api/notifications, POST /api/errors |
| Save settings | the request inside `startTransition(async () => …)` from `useTransition()` | POST /api/settings |
