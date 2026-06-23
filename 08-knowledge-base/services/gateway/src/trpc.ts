import { initTRPC } from '@trpc/server';
import { listAudits, recordAudit } from './audit.model.js';

const t = initTRPC.create();
export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  audits: publicProcedure.query((_args: unknown) => listAudits()),
  recordAudit: publicProcedure.mutation((_args: unknown) =>
    recordAudit('manual', 'system', 0),
  ),
});

export type AppRouter = typeof appRouter;
