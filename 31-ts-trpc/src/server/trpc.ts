import { initTRPC, TRPCError } from '@trpc/server';

const t = initTRPC.context<{ userId?: string }>().create();

export const createTRPCRouter = t.router;
export const mergeRouters = t.mergeRouters;
export const publicProcedure = t.procedure;
// A procedure built from another: still a procedure.
export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next();
});
