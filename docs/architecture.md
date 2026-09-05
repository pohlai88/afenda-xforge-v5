# Afenda xForge v5 — Frontend-First Architecture

| | |
| --- | --- |
| Status | Draft 1 — decisions marked **ADR** are accepted; sections marked *planned* describe intent, not code |
| Date | 2026-09-05 |
| Applies to | commit `75e8263` and later |
| Companion files | `CLAUDE.md` (operating rules), `AGENTS.md` (Next 16 + code standards), `.claude/skills/nextjs-16`, `.claude/skills/xforge-testing` |

## 0. How to read this

Every claim below is one of three kinds, and the kind is marked:

- **Verified** — read from the tree or run here on 2026-09-05 (versions, file paths, measured timings).
- **Decision (ADR-n)** — accepted and binding until superseded; the register in §10 carries status and consequences.
- *Planned* — the direction we have agreed to build toward. Nothing planned is assumed by code today.

The document is domain-agnostic on purpose: the product's screens are defined by specs that do not exist yet. Examples use a generic multi-tenant workspace (organisations, members, records) because that shape is what every SaaS shares and what the auth and tenancy seams must carry regardless of domain.

## 1. The frontend-first thesis

**Frontend-first is a sequencing decision, not the product's shape.** A SaaS backend — Postgres via Drizzle on Neon, Better Auth for identity and tenancy — is the destination. We build the product's surface first because the surface is where the product is decided: which screens exist, what each needs to know, what a user can do on it. Written down as a typed contract, those needs become the specification the backend is later built to satisfy, instead of a backend guessing at them.

Four principles follow from that, and every later section is an application of one of them.

1. **One source of truth per fact.** A type, a token, a version, a fixture is defined once and derived everywhere else. When two places must agree, one is generated from the other or a check holds them equal. (This is the lesson v4 paid for: "which components exist" was answered independently six times, and the answers drifted.)
2. **Every boundary is explicit.** Server/client, contract/adapter, design-system/application, vendored/owned. A boundary you cannot point at in the file tree is not a boundary.
3. **Verifiable by machine.** The repository is vibe-coded: the human steers from what the agent reports, never from the code. So a report is only trustworthy if every claim in it maps to a check the human can re-run — `pnpm check`, `pnpm typecheck`, `pnpm test`, `pnpm --filter @xforge/web test:e2e`. Architecture that cannot be checked is advice.
4. **Accessibility and performance are architecture, not polish.** Roles-first tests, Server Components by default, client code at the leaves, and budgets (§7) are structural choices made now because they cannot be retrofitted cheaply.

**Non-goals for this phase.** No database, no server endpoints, no authentication, no deployment topology. Each is a deliberate decision that changes `CLAUDE.md` before it changes code (§5.5, §9).

## 2. System context

```
                    ┌──────────────────────────────────────────────────────────┐
                    │                    apps/web  (Next.js 16)                 │
   Browser ◄──────► │  Server Components ──► contract interface ──► adapter    │
                    │  Client Components ◄── props / TanStack Query (planned)  │
                    └───────────────────────────────┬──────────────────────────┘
                                                    │ today: fixtures (in-process, server-only)
                                                    │ planned: Drizzle → Neon Postgres
                                                    │ planned: Better Auth (session, organisations)
```

**Verified today:** one Next.js app, one design package, no network I/O, no persistence. Every screen renders from in-process data. **Planned:** the same screens, the same contract interface, with adapters that talk to Postgres and an auth session — the seam in the middle is what makes the swap a configuration change (§5).

## 3. Repository architecture

### 3.1 Workspaces and the dependency direction

| Workspace | Package | Role | May depend on |
| --- | --- | --- | --- |
| `apps/web` | `@xforge/web` | The product: routes, screens, features | every `packages/*` |
| `packages/design` | `@xforge/design` | Design system: tokens, primitives, composites | `react`, `radix-ui`, `cn`, `cva` — **never** an app or a domain |
| `packages/typescript-config` | `@xforge/typescript-config` | Shared compiler bases | nothing |
| `packages/contracts` *(planned, §5)* | `@xforge/contracts` | Zod schemas, types, data-source interfaces, fixture factories | `zod` only — **no React, no Next** |
| `packages/mocks` *(planned, when HTTP exists)* | `@xforge/mocks` | MSW handlers derived from fixtures | `@xforge/contracts`, `msw` |
| `packages/db` *(planned, §5.5)* | `@xforge/db` | Drizzle schema + the `db` adapter | `@xforge/contracts`, `drizzle-orm` |

**ADR-001** — pnpm workspaces + Turborepo; dependencies point one way: `apps → packages`, `packages` never import an app, and `packages/design` never imports a domain package. A package that needs to know about the product is in the wrong layer.

**Verified tooling** (all pinned exactly, in `pnpm-workspace.yaml` `catalog:`): pnpm 11.20.0, Turborepo 2.10.12, Next 16.3.4, React 19.2.8, TypeScript 5.9.3, Tailwind 4.3.3, shadcn 4.21.0 on `radix-ui` 1.6.7, Biome 2.5.12 via Ultracite 7.10.8, Vitest 5.0.0, Playwright 1.62.1. Compiler bases: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`, `moduleResolution: Bundler` everywhere.

### 3.2 Adding a package — the checklist

1. `packages/<name>/package.json` with `"name": "@xforge/<name>"`, `"private": true`, versions as `catalog:` or `workspace:*`; declare `exports` for every public path.
2. Extend the right base in `tsconfig.json` (`react-library.json` for anything with JSX, `base.json` otherwise).
3. Scripts `typecheck` and `test` so Turborepo picks the package up with no `turbo.json` change.
4. Mirror any path alias in the consumer's `tsconfig.json` `paths` **and** the package `exports` — the two must agree (`CLAUDE.md` §Layout).
5. `pnpm install`, then `pnpm check && pnpm typecheck && pnpm test`.

### 3.3 Lint, format and the hook

**ADR-003** — Ultracite on the Biome backend (`biome.jsonc`). The ESLint provider was tried first and replaced the same day: ~60 s per check, 36 dev dependencies, seven provider defects; Biome checks the repository in under a second with two. Deviations from the preset are exactly two and are commented in the file: vendored `.agents/` and `.claude/` are excluded, and shadcn-generated paths keep shadcn's style. The `.claude/settings.json` hook runs the single-file fix after every agent edit; it decides nothing and blocks nothing.

## 4. Application architecture — `apps/web`

### 4.1 Routing and folders

`app/` is for routing only. Domain code lives in `features/`; the app shell in `components/`; infrastructure in `lib/`. Route groups organise URLs without changing them; private folders (`_components`) colocate route-local pieces without creating routes.

```
apps/web/
  app/
    (marketing)/            public pages — static, no session
      page.tsx
    (auth)/                 sign-in, sign-up, invitations — planned with Better Auth
      sign-in/page.tsx
    (app)/                  the product — every route here has a session (planned)
      [orgSlug]/            tenant context in the URL from day one (§5.5)
        layout.tsx          org switcher, navigation; reads session + org
        page.tsx            dashboard
        <domain>/           one folder per domain screen group
          page.tsx
          loading.tsx       streaming fallback
          error.tsx         error boundary
          _components/      route-local pieces (not a route)
    layout.tsx              root: fonts, ThemeProvider, metadata
    not-found.tsx
  features/<domain>/        components/, hooks/, queries.ts, schemas.ts, fixtures.ts — the domain's UI and logic
  components/               app shell: navigation, providers, theme
  lib/
    data/                   contract adapters and the DATA_SOURCE switch (§5.3)
    auth/                   planned: server helpers around Better Auth
  tests/                    Vitest (*.test.tsx)
  e2e/                      Playwright (*.e2e.ts)
```

**Placement rule.** If a component is used by exactly one route, it lives in that route's `_components/`. If it belongs to a domain and more than one route, `features/<domain>/components/`. If it knows nothing about the domain, it is a design-system candidate — but a component enters `packages/design` only when a screen uses it (§6.4).

### 4.2 The server/client boundary

Everything in `app/` is a Server Component unless it says `'use client'`. The working rule (from `.claude/skills/nextjs-16/references/boundary.md`):

- `'use client'` **only** when the component has state, an event handler, an effect, or a browser API — and it goes on the **leaf**, never on a page or layout. A Server Component fetches through the contract and passes plain props to a small client leaf.
- Context providers are client components that take `children` and are rendered from a server layout; the subtree inside stays server. `components/theme-provider.tsx` is the reference shape.
- Adapters and anything that will later hold a secret import `server-only` at the top. Nothing under `lib/data/` is ever imported from a `'use client'` file. This is a package-boundary rule, not a code-review hope.

**Verified today:** two Server Components (`app/layout.tsx`, `app/page.tsx`), one client file (`theme-provider.tsx`), no route handlers, no server actions, no proxy/middleware.

### 4.3 Rendering and caching

**ADR-008** — `cacheComponents` stays **off** until the first screen renders real (non-fixture) data. Next 16.3 makes it opt-in and plans to default it in a future major; it is running in production elsewhere without incident, but it changes two things we are not ready to reason about on fixtures: data becomes dynamic-by-default with `use cache` opt-ins, and client navigation switches to React `<Activity>` — the previous route is hidden, not unmounted, so component state survives navigation and effects re-run on return. Enabling it is a documented step in §9, taken when caching decisions can be made against real latency.

Until then: the previous model (`fetch` options, route segment config), Suspense boundaries with `loading.tsx` per route group, and `error.tsx` per domain. Streaming is still available and expected for any screen with more than one data dependency.

### 4.4 Data flow inside a screen

```
   Route (Server Component)
     │  await Promise.all([ds.members.list(), ds.org.get()])   ← no waterfalls
     ▼
   Screen (Server Component, features/<domain>/components/*)   ← markup, no interactivity
     │  plain props
     ▼
   Leaf ('use client'): filters, dialogs, forms, tables with sorting
     │  URL state via searchParams; form state via react-hook-form + zod
     ▼
   Mutation: today an in-memory fixture mutation; planned: Server Action → db adapter,
             revalidatePath — or TanStack Query mutation when the screen is live/optimistic
```

- **Reads** happen in Server Components through the contract interface (§5). Independent reads are started together (`Promise.all`); a screen never awaits in sequence what it could await in parallel.
- **Client server-state** — polling, optimistic updates, infinite lists — uses TanStack Query (**ADR-010**, *proposed*: Next's own client-fetching guide documents it as the standard integration; SWR is the lighter alternative if bundle size ever dominates). Until a screen needs it, it is not installed.
- **URL is the state store for anything shareable**: filters, sort, pagination, selected tab live in `searchParams` so a link reproduces the view.
- **Forms** are `react-hook-form` + the domain's zod schema (the same schema the contract uses) + shadcn's `Form` primitives. Validation messages come from the schema, once.
- **Every screen ships four states** — loading, empty, error, populated — and each has a test. A screen missing one is not done (§7.3).

## 5. The contract and data seam

This is the section that makes frontend-first work. Everything else is ordinary Next.js.

### 5.1 The contract

**ADR-005** — `packages/contracts` (*planned*, first thing built when the first screen is specified) holds, per domain:

```
packages/contracts/src/<domain>/
  schema.ts       zod schemas: entities, create/update inputs, list filters
  types.ts        `z.infer` types — the only types screens import
  source.ts       the DataSource interface: list(filter) / get(id) / create(input) / update(id, patch)
  fixtures.ts     deterministic factories (seeded) — synthetic data, never real PII
  contract.test.ts  tests any adapter must pass (shape, invariants, error cases)
```

One zod definition yields the TypeScript type, the form validator, the fixture shape and — when HTTP arrives — the request/response validation. That is principle 1 applied to data.

### 5.2 Adapters

An adapter implements a domain's `DataSource`. Three exist over the product's life; one exists now.

| Adapter | Where it runs | Backed by | Status |
| --- | --- | --- | --- |
| `fixtures` | server only (RSC, Vitest, Playwright's dev server) | in-process seeded factories; mutations live in server memory for the dev session | **today** |
| `db` | server only | Drizzle → Neon Postgres | *planned* (§5.5) |
| `http` | client (TanStack Query) | Route Handlers / server functions that themselves call `db` | *planned, when a screen needs live client data* |

`lib/data/index.ts` selects by `DATA_SOURCE` (`fixtures` default in dev and test; `db` in production once it exists) and is the **only** module that knows adapters exist. Screens import `getDataSource()` and nothing else. The contract tests in `packages/contracts` run against every adapter, so the fixture adapter and the database adapter are held to the same behaviour — the fixtures are not a toy, they are the executable specification.

### 5.3 Why in-process adapters, and where MSW fits

The obvious alternative is HTTP-first: RSCs `fetch` an API that MSW mocks. It is what v4 did ("the MSW handlers are the API"). We are not doing that first, for three reasons:

1. **There is no transport to mock yet.** Whether the backend is Route Handlers, server functions, or an RPC layer is undecided; committing to HTTP shapes now decides it by accident.
2. **RSC + MSW is workable but not free.** Server-side interception needs `msw/node` started from `instrumentation.ts`, and Next patches `fetch` in ways that have needed fixes on both sides; unhandled requests abort. It is a solved integration, not a zero-cost one.
3. **The contract is the source of truth, not the wire format.** An interface + zod schema is what the backend must implement either way; the HTTP encoding is derived from it later.

MSW enters the moment HTTP exists — client fetches, or an e2e that must see network failures — and its handlers are **generated from the same fixtures** (`packages/mocks`), so the browser and the server never disagree about the data. Playwright's network needs are met first by `page.route()` against the dev server; a full MSW browser worker is the escalation, not the default.

### 5.4 Contract rules

- Screens never import `fixtures.ts` directly. Fixtures are reached through the adapter, so swapping the adapter cannot leave a screen secretly reading fake data.
- Fixture factories are seeded and deterministic; a test that depends on a value asserts the value, not the seed.
- No real personal data in fixtures — names, emails and identifiers are synthetic. This is a privacy rule and a legal one.
- A change to a schema is a change to the contract tests in the same commit.

### 5.5 When the backend lands — the playbook

*Planned.* The decision is the human's; the mechanics are known:

1. **Identity — Better Auth.** `auth.ts` on the server; the Next handler at `/api/auth/[...all]`; the `nextCookies` plugin because Server Components cannot set cookies (the cookie cache refreshes only through Server Actions or Route Handlers). In RSC and layouts: `auth.api.getSession({ headers: await headers() })`. In client leaves: `authClient.useSession()`. Environment: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`.
2. **Tenancy — the `organization` plugin.** Organisations, members, invitations, roles. The `(app)/[orgSlug]` route segment already carries the tenant; the layout resolves the slug to an organisation the session may access, and every adapter call receives the organisation id. Designing the URL this way now is why the backend slots in without a route rewrite.
3. **Persistence — Drizzle on Neon.** `packages/db` holds the schema; the `db` adapter implements each `DataSource`; `@better-auth/cli generate` emits the auth tables into the same Drizzle schema; migrations through `drizzle-kit`. The contract tests run against a Neon branch in CI.
4. **Flip `DATA_SOURCE=db`** for production; keep `fixtures` for Vitest and for any environment without a database.
5. **Then** revisit `cacheComponents` (§4.3) with real latency to reason about.

## 6. Design system architecture — `packages/design`

### 6.1 Layers

```
tokens        globals.css: @theme inline over oklch CSS variables (light + .dark), radius scale, fonts
   ▼
primitives    shadcn/ui components on Radix (radix-ui 1.6.7) — generated by the CLI, styled by tokens
   ▼
composites    compound components assembled from primitives (Card + CardHeader…, DataTable, FormField)
   ▼
feature UI    apps/web/features/<domain>/components — knows the domain, uses only the layers above
   ▼
screens       apps/web/app/**/page.tsx — composition only; no styling decisions of its own
```

**ADR-004** — shadcn/ui on the **Radix** base for the scaffold. `@base-ui/react` has been stable since 1.0.0 (December 2025), is at 1.8.0, and has been shadcn's default base since July 2026; Radix is still supported and every shadcn component ships for both. Starting on Radix was a choice for the primitives the team already knows, not a maturity wait. The migration is per component through the `migrate-radix-to-base` skill (shadcn's documented route, which writes a report per component under `.migration/`); §9 schedules the decision.

### 6.2 Token rules

- Colour, space, radius and type come from `@theme` tokens; components use semantic utilities (`bg-primary`, `text-muted-foreground`), never a hex or an arbitrary value. Biome's `useSortedClasses` knows `cn` and `cva`.
- A missing value is added to `globals.css` — `:root`, `.dark`, and `@theme inline` in the same edit — not worked around with the nearest class that compiles. (v4's recorded failure mode: a text colour applied to an empty element painted nothing, and every check stayed green.)
- Ink goes on things with text; fills go on things without. A value used by two components is one token.
- Dark mode is the `.dark` class set by `next-themes` (`attribute="class"`), declared to Tailwind by `@custom-variant dark`.

### 6.3 Composition rules

From the React composition guidance in force here:

- **No boolean-prop proliferation.** `<Dialog size="lg" withFooter>` becomes `<Dialog><DialogFooter>…`. Behaviour is composed from parts, not switched on.
- **Compound components share context**; the provider is the only place that knows how state is managed.
- **Children over render props**; explicit variant components over mode booleans; `cva` for the variant axes a primitive genuinely has.
- **React 19**: `ref` is a prop — no `forwardRef`; `use()` over `useContext()`.

### 6.4 What enters the design package

A component enters `packages/design` when a screen uses it and it knows nothing about the domain — not before (building a library ahead of screens is how v4 accumulated components nobody rendered). shadcn components are added with `pnpm dlx shadcn@4.21.0 add <name> -c apps/web` and land in `packages/design/src/components/`; hand-written composites sit beside them and follow the same file anatomy.

## 7. Quality architecture

### 7.1 The gates

| Gate | Command | Verified timing | Runs |
| --- | --- | --- | --- |
| Lint + format | `pnpm check` | ~0.25 s | every edit (hook, single file) and before any claim of done |
| Types | `pnpm typecheck` | ~12 s | before done |
| Components | `pnpm test` (Vitest 5, Testing Library, jsdom) | ~25 s | before done |
| Browser | `pnpm --filter @xforge/web test:e2e` (Playwright, port 3100) | ~11 s incl. server start | per screen path |
| Build | `pnpm build` | ~15 s | before done |

### 7.2 Test doctrine (`.claude/skills/xforge-testing`)

Two runners split by filename — `*.test.tsx` renders components under Vitest, `*.e2e.ts` drives the browser. Component tests query by **role first** (`getByRole`, then label, text; `getByTestId` needs a comment). Interaction uses `user-event`, never `fireEvent`. A component's states, variants and a11y roles are Vitest; navigation, layout and real server responses are Playwright. Playwright uses a dedicated port so a stale server on 3000 is never tested by mistake.

### 7.3 Definition of done for a screen

- All four states rendered and tested (loading, empty, error, populated).
- One Playwright path through the screen's primary action.
- No token added outside `@theme`; no `'use client'` above a leaf.
- Reads parallelised; nothing awaited in sequence that could be parallel.
- `pnpm check`, `typecheck`, `test`, `build` green — and the report says so with the commands it ran.

### 7.4 Budgets — *planned, enforced in CI*

- Core Web Vitals: LCP < 2.5 s, INP < 200 ms, CLS < 0.1 on the product's slowest screen, measured in Playwright.
- Accessibility: axe (`@axe-core/playwright`) with zero serious/critical violations per screen; WCAG 2.2 AA as the bar.
- Bundle: `@next/bundle-analyzer` on every build; a client bundle that grows by more than 10 % needs a sentence in the PR.
- Coverage: when added, `turbo.json`'s `test` task gains `"outputs": ["coverage/**"]` in the same commit — a cached task with no restorable artefact is a trap.

### 7.5 Performance rules in force

From the Vercel React guidance installed here, the ones that shape architecture rather than code review: eliminate waterfalls (`Promise.all`, Suspense boundaries), import directly rather than through barrel files, `next/dynamic` for heavy client components, load third-party scripts after hydration, derive state during render rather than in effects, and keep interaction logic in event handlers.

## 8. Security and privacy posture

Frontend-first does not mean security-later; it means the seams that will carry secrets are drawn now.

- Modules that will hold secrets (`lib/data/*`, later `lib/auth/*`) import `server-only`; a client import fails the build rather than leaking at runtime.
- No secrets in the repository; `.env*` is ignored; Turborepo's `build` task hashes `.env*` so a changed variable invalidates the cache.
- Fixtures are synthetic (§5.4).
- When Better Auth lands: `trustedOrigins` for CSRF, rate limiting on, cookie cache versioned; the `security.md` checklist in the `better-auth` skill is the gate.
- Supply chain: exact pins, pnpm's `minimumReleaseAge` policy, install scripts blocked except the two allow-listed.

## 9. Evolution — ordered, each a deliberate step

1. **Contract package** (first screen spec) — `packages/contracts`, fixture adapter, contract tests. *Unblocks every screen.*
2. **Screens on fixtures** — feature folders, four states each, roles-first tests, one e2e per path.
3. **Base UI decision** — migrate per component with the `migrate-radix-to-base` skill, or stay on Radix; decided when the design package has enough components for the difference to matter (Base UI's `render` prop model vs Radix's `asChild`).
4. **Client server-state** — TanStack Query when the first live/optimistic screen appears.
5. **Backend** — Better Auth + organisations, Drizzle + Neon, `db` adapter; `DATA_SOURCE=db` (§5.5).
6. **Cache Components on** — with real latency to reason about; audit for `<Activity>` navigation assumptions.
7. **Hardening** — CI budgets (§7.4), multi-browser Playwright, coverage, TypeScript 7 once the toolchain is validated against it.

## 10. ADR register

| ADR | Decision | Status | Consequence |
| --- | --- | --- | --- |
| 001 | pnpm workspaces + Turborepo; `apps → packages` only | Accepted | New shared code is a package with `exports`; no app imports from another app |
| 002 | Next.js 16 App Router on Turbopack; Server Components by default | Accepted | `'use client'` at leaves; providers wrap `children` |
| 003 | Ultracite on Biome (replaced the ESLint provider) | Accepted | One `biome.jsonc`; sub-second checks; shadcn paths exempted narrowly |
| 004 | shadcn/ui on the Radix base now; Base UI (stable, shadcn default) migration decided in step 3 | Accepted | Do not mix `@base-ui/react` into `packages/design` before the decision |
| 005 | Contract-first data seam: zod contract, `DataSource` interface, in-process fixture adapter now, `db`/`http` adapters later | Accepted | `packages/contracts` is built before the first screen; screens never see adapters |
| 006 | Test runners split by suffix: `*.test.tsx` Vitest, `*.e2e.ts` Playwright on port 3100 | Accepted | No `.spec.ts` files; roles-first queries |
| 007 | Exact version pins via the pnpm catalog; `save-exact` | Accepted | Bumps are one-line catalog edits |
| 008 | `cacheComponents` off until real data exists | Accepted | Previous caching model; revisit at step 6 |
| 009 | Backend = Better Auth (organisations) + Drizzle + Neon, behind the same contract | Accepted, not implemented | `[orgSlug]` in the URL from day one; `server-only` on adapters |
| 010 | TanStack Query for client server-state | Proposed | Installed only when a screen needs it; SWR is the fallback if bundle size dominates |

## 11. Open questions

- **Transport for `http`** — Route Handlers, Next server functions, or an RPC layer (oRPC/tRPC) that can serve the contract to a future mobile client. Decide before `packages/mocks` is generated; the contract does not care.
- **Product domain and first screen** — this document is waiting on the first spec to name the first `packages/contracts` domain.
- **Tenant URL shape** — `/[orgSlug]/…` (chosen provisionally) vs subdomains; Better Auth's organisation plugin supports both, the URL form is the cheaper one to run locally and in preview deployments.
- **Design-system governance** — v4 grew a token bridge and an adapter file schema with generated manifests. Whether v5 needs that machinery is decided by evidence from step 2, not up front.

## Sources

- Next.js — [cacheComponents](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents), [project structure](https://nextjs.org/docs/app/getting-started/project-structure), [client-side data fetching](https://nextjs.org/docs/app/guides/client-side-data-fetching), [TanStack Query guide](https://nextjs.org/docs/app/guides/client-side-data-fetching/tanstack-query)
- shadcn/ui — [July 2026: Base UI as the default](https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default), [January 2026: Base UI documentation](https://ui.shadcn.com/docs/changelog/2026-01-base-ui); npm `@base-ui/react` 1.0.0 (2025-12-11) → 1.8.0 (2026-09-04), verified
- Better Auth — [Next.js integration](https://better-auth.com/docs/integrations/next), [getSession in RSC with cookie cache (issue #7008)](https://github.com/better-auth/better-auth/issues/7008), [multi-tenant setup discussion](https://github.com/better-auth/better-auth/discussions/3317)
- MSW + Next.js — [Next.js 16 × MSW integration demo](https://github.com/laststance/next-msw-integration), [E2E with Next.js, Playwright and MSW](https://safedep.io/end-to-end-test-nextjs-msw-playwright/), [mocking client- and server-side requests](https://www.ajth.in/blog/msw-with-playwright-nextjs/)
- Data-layer patterns — [structuring a data access layer in Next.js](https://medium.com/@samrose.mohammed/structuring-your-data-access-layer-in-next-js-patterns-that-actually-scale-2e4c07491866), [contract-first development](https://developers.redhat.com/blog/2020/04/28/contract-first-development-create-a-mock-back-end-for-realistic-data-interactions-with-react), [BFF pattern in Next.js](https://dev.to/behnamrhp/nextjs-and-bff-architecture-the-missing-piece-in-modern-fullstack-apps-5al7)
- Client data libraries — [TanStack Query vs SWR vs Apollo, 2026](https://www.pkgpulse.com/guides/tanstack-query-vs-swr-vs-apollo-2026)
- Installed skills applied: `nextjs-16`, `xforge-testing`, `vercel-react-best-practices`, `vercel-composition-patterns`, `tailwind-design-system`, `msw`, `better-auth`, `pnpm-workspace`, `turborepo`, `typescript-strict`
