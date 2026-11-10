import { healthRouter } from './routers/health';
import { pollsRouter } from './routers/polls';
import { createTRPCRouter, mergeRouters } from './trpc';

export const appRouter = mergeRouters(createTRPCRouter({ polls: pollsRouter }), healthRouter);
export type AppRouter = typeof appRouter;
