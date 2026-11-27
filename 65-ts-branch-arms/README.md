# 65-ts-branch-arms — a handler's two ways, for drawing

A written fixture for veoagents: its answers are in `expected.yaml`, written from the code. It
holds the shape of the sixclear email sign-in (veoagents #458): a handler that takes one of two
ways on its own local state, which no guard of a parameter decides.

| UI action (`web/src/components/SignIn.tsx`) | Server side (`api/src/routes.ts`) | Reaches |
| --- | --- | --- |
| Sign in | `findUser`, then `if (user !== undefined)` a session request, `else` `validatePortal` and `createUser`; `logAttempt` before and `portalLogin` after, either way | identity.example.com, portal.example.com |

The flow reaches both ways. The steps on one way carry that branch (`arm`) so the console can draw
them as alternatives; the steps made either way carry none.
