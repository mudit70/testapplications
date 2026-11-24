import { WorkOS } from "@workos-inc/node";
import { handleWorkosEvent } from "./handle";

// Checks the delivery, then hands the event to the handler for its type (handle.ts).
export async function POST(req: Request) {
  const workos = new WorkOS(process.env.WORKOS_API_KEY);
  let webhook = null;
  try {
    webhook = await workos.webhooks.constructEvent({
      payload: await req.json(),
      sigHeader: req.headers.get("workos-signature") ?? "",
      secret: process.env.WORKOS_WEBHOOK_SECRET as string,
    });
  } catch {
    return new Response("bad signature", { status: 400 });
  }
  await handleWorkosEvent(webhook);
  return new Response("ok");
}
