import { eq } from "drizzle-orm";
import express from "express";
import { db } from "./db";
import { monitor, workspace } from "./db/schema";

const app = express();

/** The signed-in user with their workspaces: two levels of with:. */
app.get("/api/me", async (_req, res) => {
  const me = await db.query.user.findFirst({
    with: { usersToWorkspaces: { with: { workspace: true } } },
  });
  res.json(me);
});

/** A workspace with its monitors and notifications, but not its members (false). */
const withAlerts = { with: { monitors: true, notifications: true, usersToWorkspaces: false } };
app.get("/api/workspaces/:slug", async (req, res) => {
  const found = await db.query.workspace.findFirst({
    where: eq(workspace.slug, req.params.slug),
    ...withAlerts,
  });
  res.json(found);
});

/** A monitor, no with: only its own table. */
app.get("/api/monitors/:id", async (req, res) => {
  const found = await db.query.monitor.findFirst({ where: eq(monitor.id, Number(req.params.id)) });
  res.json(found);
});

app.listen(8080);
