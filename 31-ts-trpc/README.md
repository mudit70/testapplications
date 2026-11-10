# 31-ts-trpc — tRPC and server actions (Next.js + tRPC 11 + Prisma)

A written fixture for veoagents: its answers are in `expected.yaml`, written from the code.

| UI action | Dispatch | Reaches |
| --- | --- | --- |
| Create poll | `api.polls.create.useMutation().mutateAsync`, then `utils.polls.list.fetch()` | POST /api/trpc/polls.create, GET /api/trpc/polls.list |
| Vote | `useMutation(trpc.polls.options.vote.mutationOptions())` (tanstack options style) | POST /api/trpc/polls.options.vote (a plain-object record nested in the polls router) |
| Close poll | `const { mutate: close } = api.polls.close.useMutation()` | POST /api/trpc/polls.close |
| Delete poll | a `'use server'` function called directly | Option, Poll |
| Share | next-safe-action: `useAction(logAction).execute` | AuditLog |

The app router merges the polls router with a health router and is served by `fetchRequestHandler` at `/api/trpc`. `src/server/routers/legacy.ts` defines a router no adapter serves: its procedure must not appear.
