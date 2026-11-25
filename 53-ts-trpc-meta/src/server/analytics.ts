import { OpenPanel } from "@openpanel/sdk";

const op = new OpenPanel({ clientId: process.env.OPENPANEL_CLIENT_ID ?? "" });

/** The analytics client: OpenPanel in production, a no-op elsewhere. */
export async function setupAnalytics(userId: string) {
  if (process.env.NODE_ENV !== "production") return noop();
  await op.identify({ profileId: userId });
  return {
    track: (event: { name: string }) => op.track(event.name, {}),
  };
}

async function noop() {
  return { track: (_event: { name: string }): Promise<unknown> => Promise.resolve(null) };
}
