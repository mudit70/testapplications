# 35-ts-server-steps — server-side steps of TypeScript flows

A written fixture for veoagents: its answers are in `expected.yaml`, written from the code. It
holds the server-side shapes the #28 reviews of unkey, openstatus and realworld found cut short
(veoagents #379, #380, #381, #386), in one repository of three services.

| UI action (`web/src/components/Dashboard.tsx`) | Server side | Reaches |
| --- | --- | --- |
| Subscribe | `auth()` of NextAuth with a DrizzleAdapter; `getStripeClient()` returns a `let` singleton made on first use; `db.transaction(async (tx) => …)` | session, user (read); api.stripe.com; subscriptions, audit_log (written) |
| Invite | `WorkOSAuthProvider`, whose `provider` field is `new WorkOS(apiKey)`; `loadSealedSession` unseals locally, `session.refresh()` and `sendInvitation` call WorkOS | api.workos.com |
| Search | `withRatelimit(limiter: Ratelimit \| undefined)`, `structuredSearch(client: OpenAI \| null)` | api.unkey.com, api.openai.com |
| Authorize deployment | `createCtrlClient(DeployService)` returns a Connect client; `ctrl.authorizeDeployment()` | POST /ctrl.v1.DeployService/AuthorizeDeployment, served by the Go ctrl service |
| Sync environment | `new Vercel({ accessToken })`, whose base URL defaults to `https://api.vercel.com`; `new URL(path.join("/"), base)` | api.vercel.com |
| Upload logo | `put()` of `@vercel/blob` | vercel.com |
| Feed | `GET /api/feed` on the Express API, behind express-jwt's `auth.required` and `audit` | the route's middleware, in order |

`ctrl/gen` and `web/src/gen` stand for generated code (protoc-gen-connect-go, protoc-gen-es).
