import { keysRouter } from "./routers/keys";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({ keys: keysRouter });

export type AppRouter = typeof appRouter;
