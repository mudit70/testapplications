# 56-ts-hono-use — a Hono sub-router's use() middleware, once mounted

A written fixture for veoagents. Its answers are in `expected.yaml`, written from the code. It comes from veoagents #420, which is based on openstatus's Slack routes: `slack.use("*", …)` in a sub-router the server mounts with `app.route("/slack", slackRoute)`.

| UI action (`web/src/SlackSettings.tsx`) | Route | Middleware before the handler | Reaches |
| --- | --- | --- | --- |
| Install | GET /slack/install | `slack.use("*")`, which calls Slack's auth.test | slack.com |
| Send test event | POST /slack/events | `slack.use("*")`, then `slack.use("/events", verifySlackSignature)` | slack.com |
| Ping | GET /ping | none (the app's own route, outside the sub-router) | none |

The sub-router's routes are served under the mount only: `/slack/install`, not `/install` as well.
