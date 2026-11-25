import { Hono } from "hono";
import { slackRoute } from "./routes/slack";

const app = new Hono();

app.get("/ping", (c) => c.text("pong"));
app.route("/slack", slackRoute);

export default app;
