# Server Actions — for the day the backend is agreed

Source: `nextjs.org/docs/app/guides/server-actions` (version 16.3.4, lastUpdated 2026-06-17).

**This file is not guidance for today.** CLAUDE.md says screens are built against local or mocked
data, and there are no `'use server'` directives in this repository. It is written down now because
the SaaS backend is the destination and the security model below is the part most often
recalled wrong.

## What a Server Action actually is

A **POST request against the page that invokes it.** At build time `'use server'` swaps the
function's implementation in client bundles for a reference — an action ID plus a dispatcher —
that POSTs back. The implementation stays server-side, but **the route is reachable by anyone
who can send the same POST.** Treat every action as an untrusted public entry point.

This is the sentence that matters: rendering a form only on an authenticated page is **not a
security boundary**, because the request need not come through the UI.

## What the framework gives you

- **CSRF** — `Origin` compared against `Host` / `X-Forwarded-Host`; mismatches rejected.
  Behind a proxy or CDN, configure `serverActions.allowedOrigins`.
- **Body size** — capped at 1MB by default; `serverActions.bodySizeLimit` to raise.
- **Encrypted action IDs and dead-code elimination** — unused server functions are stripped
  from client bundles, so they expose no endpoint.
- **Closure encryption** — variables captured by an inline action are encrypted before going
  to the client. Multi-instance or self-hosted deployments must set a stable
  `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` shared across instances.

## What you still owe, inside every action

- **Authenticate and authorize.** Explicitly, in the action body.
- **Validate inputs.** `FormData`, query parameters and headers are untrusted.
- **Constrain return values.** Returns are serialized to the client — shape them to what the
  UI renders, never a raw database record.

Destructive operations may warrant elevated session checks or re-authentication, and should
**fail loudly** when those checks are missing.

```ts
'use server'
export async function deletePost(postId: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
  if (!(await canDelete(session.user, postId))) throw new Error('Forbidden')
  // ...
}
```
