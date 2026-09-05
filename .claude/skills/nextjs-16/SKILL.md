---
name: nextjs-16
description: Next.js 16 in this repository — the App Router surface actually in use under apps/web, the client/server boundary, and the caching model. Use when writing or reviewing anything under apps/web, when adding a route, layout, page or client component, when notFound or next/navigation is involved, and before reaching for a server feature (route handler, Server Action, server data fetching). Read this before trusting recalled Next.js knowledge — the widely-known material describes Next 14 and is wrong here.
metadata:
  targets: "next@16.3.4"
  built: "2026-09-05"
  source: "nextjs.org/docs, frontmatter version 16.3.4"
---

# Next.js 16 here

Built on 2026-09-05 from `nextjs.org/docs` pages carrying `version: 16.3.4`. The workspace
pins `next` to **16.3.4** through the pnpm catalog in `pnpm-workspace.yaml`, so the documented
and running versions match exactly. When the catalog entry moves, this skill is stale — it says
so by being wrong about a version number rather than quietly about behaviour.

Next also ships version-matched docs at `node_modules/next/dist/docs/`; the root `AGENTS.md`
says to read those before writing code. Do.

## Why this exists rather than a general Next.js skill

Every Next.js skill in the public registry targets **14+**. Next 16 replaced the caching model
outright — `cacheComponents` (16.0.0) folds `ppr`, `useCache` and `dynamicIO` into one flag,
and `experimental.ppr` and the `experimental_ppr` segment export were **removed**. 14-era
knowledge is therefore not merely incomplete here; it names configuration that no longer
exists. That is the failure this skill is against.

## What this repository actually is

Frontend-first, and that is a **sequencing decision, not the product's shape**. A SaaS backend
is the destination (see `CLAUDE.md`); there is no database, server or authentication in this
repository today, and the Next.js surface in use is deliberately small. Measured 2026-09-05,
at the v5 scaffold:

    apps/web/app/              layout.tsx, page.tsx — Server Components, both export metadata
    apps/web/components/       theme-provider.tsx — the only 'use client' file
    'use server'               none
    route handlers             none
    proxy / middleware         none
    next.config.ts             transpilePackages: ["@xforge/design"] — nothing else
    cacheComponents            NOT set → the previous caching model is in force
    reactCompiler              NOT set

Re-measure before relying on these numbers; they describe the scaffold, and screens are added
on top of it.

## The standing position, and how to change it

Screens are built against local or mocked data at the UI edge. Do not add a Route Handler, a
Server Action or server-side `fetch` to satisfy a screen while the backend is undecided — a
server path added now is one nobody has designed, and it hides the API contract the screen
actually needs. When the backend lands, that is a deliberate decision that changes `CLAUDE.md`
before it changes code; `references/server-actions.md` is written for that day and is not
guidance for today.

## References

Load the one you need; none is required reading up front.

| File | Read it when |
|---|---|
| `references/boundary.md` | adding a component, deciding `'use client'`, passing data across the seam |
| `references/caching.md` | anything about caching, PPR, `use cache`, or a 14-era caching memory |
| `references/not-found.md` | touching `notFound()` — including the status-code trap |
| `references/server-actions.md` | **not today.** The day a real backend is agreed |

## Two things most likely to be recalled wrong

1. **`experimental.ppr` does not exist in 16.** PPR is what `cacheComponents: true` does. This
   repo has that flag off, so it is on the previous model — `fetch` options, `unstable_cache`,
   route segment configs.
2. **`notFound()` needs no `return`,** and a `try/catch` around it silently swallows the
   not-found UI. See `references/not-found.md`.
