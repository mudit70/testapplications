import { db } from '../db';
import { createTRPCRouter, publicProcedure } from '../trpc';

// Never served: no adapter takes this router, so it exposes nothing.
export const legacyRouter = createTRPCRouter({
  dump: publicProcedure.query(() => db.auditLog.findMany()),
});
