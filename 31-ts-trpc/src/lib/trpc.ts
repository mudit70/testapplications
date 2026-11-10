import { createTRPCReact } from '@trpc/react-query';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import type { AppRouter } from '~/server/root';

// The react-query style client.
export const api = createTRPCReact<AppRouter>();
// The tanstack options style.
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
