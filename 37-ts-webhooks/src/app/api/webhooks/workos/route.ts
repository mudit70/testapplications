import { WorkOS } from "@workos-inc/node";
import { db } from "@/db";
import { signups } from "@/db/schema";

export async function POST(req: Request) {
  const workos = new WorkOS(process.env.WORKOS_API_KEY);
  const webhook = await workos.webhooks.constructEvent({
    payload: await req.json(),
    sigHeader: req.headers.get("workos-signature") ?? "",
    secret: process.env.WORKOS_WEBHOOK_SECRET as string,
  });
  if (webhook.event === "user.created") {
    await db.insert(signups).values({ email: webhook.data.email });
  }
  return new Response("ok");
}
