import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { db } from "@/db";
import { cancellations, payment_failures, plan_changes, subscriptions } from "@/db/schema";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("missing signature", { status: 400 });
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch {
    return new Response("bad signature", { status: 400 });
  }
  // Each event type's own work: a delivery runs only its case.
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
      await db.insert(plan_changes).values({ subscriptionId: sub.id });
      // Only on this event: an unpaid plan is cancelled, which Stripe follows with
      // customer.subscription.deleted.
      if (sub.status === "unpaid") await stripe.subscriptions.cancel(sub.id);
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await db.insert(cancellations).values({ subscriptionId: sub.id });
      await db.delete(subscriptions).where(eq(subscriptions.id, sub.id));
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      await db.insert(payment_failures).values({ invoiceId: String(invoice.id) });
      break;
    }
  }
  return new Response("ok");
}
