import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const keysRouter = createTRPCRouter({
  /** Tracked: .meta({ track }). */
  create: protectedProcedure
    .meta({ track: { name: "create_api_key" } })
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => ({ id: "key_1", name: input.name })),
  /** Not tracked: no meta. */
  rename: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ input }) => input),
});
