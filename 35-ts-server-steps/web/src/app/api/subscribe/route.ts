import { db } from "@/db";
import { auditLog, subscriptions } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getStripeClient } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { priceId } = (await req.json()) as { priceId: string };
  const stripe = getStripeClient();
  const sub = await stripe.subscriptions.create({
    customer: session.user.id,
    items: [{ price: priceId }],
  });
  await db.transaction(async (tx) => {
    await tx.insert(subscriptions).values({ id: sub.id, userId: session.user.id, stripeId: sub.id });
    await tx.insert(auditLog).values({ event: "subscription.created" });
  });
  return Response.json({ id: sub.id });
}
