import { initTRPC } from "@trpc/server";
import { after } from "next/server";
import { setupAnalytics } from "./analytics";

type Meta = { track?: { name: string } };

const t = initTRPC.meta<Meta>().create();

export const createTRPCRouter = t.router;

/** Runs the procedure, then tracks it, after the response, only when its meta says to. */
const enforceUser = t.middleware(async (opts) => {
  const result = await opts.next();
  after(async () => {
    const { meta } = opts;
    if (meta?.track) {
      const analytics = await setupAnalytics("usr_1");
      await analytics.track(meta.track);
    }
  });
  return result;
});

export const protectedProcedure = t.procedure.use(enforceUser);
