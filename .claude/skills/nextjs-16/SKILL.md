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
is the destination (see `CLAUDE.md`); there is no database, server endpoint or authentication in
this repository today. Screens read and mutate through the contract seam (`@xforge/contracts`,
served by the fixture adapter behind `apps/web/lib/data`). Measured 2026-09-05, after the
members slice:

    apps/web/app/              (marketing)/page, (auth)/sign-in/page, (app)/[orgSlug]/{layout,page},
                               (app)/[orgSlug]/members/{page,loading,error}, (app)/not-found, not-found
    params / searchParams      Promises — `await params` in every page and layout
    'use client'               6 app files: components/theme-provider, components/app-shell/sidebar-nav,
                               features/members/components/{members-filters,member-row-actions,invite-member-dialog},
                               app/(app)/[orgSlug]/members/error.tsx — all leaves
    'use server'               features/members/actions.ts — inviteMember, updateMemberRole, removeMember;
                               each resolves the organization from the URL slug and returns an ActionResult
    route handlers             none
    proxy / middleware         none
    next.config.ts             transpilePackages: ["@xforge/design"] — nothing else
    cacheComponents            NOT set → the previous caching model is in force
    reactCompiler              NOT set

Re-measure before relying on these numbers; they describe the first slice, and screens are
added on top of it.

## The standing position, and how to change it

Screens read through `getDomainSources()` in Server Components and mutate through Server
Actions that call the same interface — that seam is the API contract. Do not add a Route
Handler or server-side `fetch` to satisfy a screen while the transport is undecided; a server
endpoint added now is one nobody has designed. When the backend lands, that is a deliberate decision that changes `CLAUDE.md`
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
