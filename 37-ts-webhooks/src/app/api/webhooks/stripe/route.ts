import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("missing signature", { status: 400 });
  const event = stripe.webhooks.constructEvent(
    await req.text(),
    signature,
    process.env.STRIPE_WEBHOOK_SECRET as string,
  );
  switch (event.type) {
    case "customer.subscription.created": {
      const sub = event.data.object as Stripe.Subscription;
      await db
        .insert(subscriptions)
        .values({ id: sub.id, customerId: String(sub.customer), status: sub.status });
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      await db.update(subscriptions).set({ status: sub.status }).where(eq(subscriptions.id, sub.id));
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await db.delete(subscriptions).where(eq(subscriptions.id, sub.id));
      break;
    }
  }
  return new Response("ok");
}
