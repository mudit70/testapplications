import { stripe } from "@/lib/stripe";

// Stripe sends invoice.created, but no handler of this app handles it: no later step.
export async function POST(req: Request) {
  const { customer } = (await req.json()) as { customer: string };
  const invoice = await stripe.invoices.create({ customer });
  return Response.json({ id: invoice.id });
}
