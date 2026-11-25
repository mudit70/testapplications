# 55-ts-default-base — a client's base URL from a literal default

A written fixture for veoagents: its answers are in `expected.yaml`, written from the code
(veoagents #419, from unkey's Vercel client and openstatus's BetterStack importer). The clients
live in packages of their own, called from the web app, so neither package sees who constructs or
calls it.

| UI action (`apps/web/src/Integrations.tsx`) | Client | Base URL | Reaches |
| --- | --- | --- | --- |
| Load projects, Save | `new Vercel({ accessToken })` (`packages/vercel`) | `this.baseUrl = opts.baseUrl ?? "https://api.vercel.com"`, used as `new URL(path, this.baseUrl)` | api.vercel.com |
| Import monitors | `createBetterstackClient(apiKey)` (`packages/importers`) | `baseUrl = "https://uptime.betterstack.com"`, requested as `let url = \`${baseUrl}${path}\`` in a loop | uptime.betterstack.com |
