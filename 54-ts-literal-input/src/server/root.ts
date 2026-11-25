import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "./trpc";

const notificationRouter = createTRPCRouter({
  /** Sends a test message through the provider the form is for. */
  sendTest: publicProcedure
    .input(z.object({ provider: z.enum(["telegram", "whatsapp", "slack"]), to: z.string() }))
    .mutation(async (opts) => {
      if (opts.input.provider === "telegram") {
        await fetch("https://api.telegram.org/bot/sendMessage", { method: "POST" });
        return;
      }
      if (opts.input.provider === "whatsapp") {
        await fetch("https://api.twilio.com/2010-04-01/Messages.json", { method: "POST" });
        return;
      }
      if (opts.input.provider === "slack") {
        await fetch("https://slack.com/api/chat.postMessage", { method: "POST" });
      }
    }),
});

export const appRouter = createTRPCRouter({ notification: notificationRouter });

export type AppRouter = typeof appRouter;
