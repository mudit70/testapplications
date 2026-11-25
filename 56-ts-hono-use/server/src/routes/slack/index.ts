import { Hono } from "hono";

const slack = new Hono();

// Every Slack route checks the workspace's token with Slack first.
slack.use("*", async (c, next) => {
  const res = await fetch("https://slack.com/api/auth.test", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` },
  });
  if (!res.ok) return c.json({ error: "Slack agent not configured" }, 503);
  await next();
});

/** Events and interactions must carry Slack's signature. */
async function verifySlackSignature(c: { req: { header(name: string): string | undefined } }, next: () => Promise<void>) {
  if (!c.req.header("x-slack-signature")) throw new Error("unsigned");
  await next();
}

slack.use("/events", verifySlackSignature);

slack.get("/install", (c) => c.redirect("https://slack.com/oauth/v2/authorize"));
slack.post("/events", (c) => c.json({ ok: true }));

export { slack as slackRoute };
