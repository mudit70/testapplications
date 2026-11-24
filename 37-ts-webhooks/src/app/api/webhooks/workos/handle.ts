import { directory } from "@/lib/directory";

/** The work for each WorkOS event the route hands over. */
export async function handleWorkosEvent(webhook: { event: string; data: { id: string; email: string } }) {
  if (webhook.event === "user.created") {
    await directory.member.create({ data: { email: webhook.data.email } });
  } else if (webhook.event === "user.deleted") {
    await directory.departure.create({ data: { userId: webhook.data.id } });
  }
}
