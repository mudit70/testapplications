import Stripe from "stripe";

let stripeClient: Stripe | null = null;

/** One client, made on first use. */
export function getStripeClient(): Stripe {
  if (stripeClient) return stripeClient;
  stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  return stripeClient;
}
