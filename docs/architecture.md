# Afenda xForge v5 — Frontend-First Architecture

| | |
| --- | --- |
| Status | Draft 2 — decisions marked **ADR** are accepted; sections marked *planned* describe intent, not code |
| Date | 2026-09-05 (first slice landed the same day; see §9) |
| Applies to | commit `9400dbf` and later; Base UI from the migration commits that follow `8d65c26` |
| Companion files | `CLAUDE.md` (operating rules), `AGENTS.md` (Next 16 + code standards), `.claude/skills/nextjs-16`, `.claude/skills/xforge-testing` |

## 0. How to read this

Every claim below is one of three kinds, and the kind is marked:

- **Verified** — read from the tree or run here on 2026-09-05 (versions, file paths, measured timings, test counts).
- **Decision (ADR-n)** — accepted and binding until superseded; the register in §10 carries status and consequences.
- *Planned* — the direction we have agreed to build toward. Nothing planned is assumed by code today.

The document is domain-agnostic on purpose. The first domain built — the workspace core of organisations and members — is what every SaaS shares and what the auth and tenancy seams must carry regardless of product; it is used as the worked example throughout.

**The product** is a multi-tenant enterprise operations / ERP SaaS platform with domain modules such as HR, payroll, finance and operations. Payroll semantics stay local to their module: nothing payroll-specific — a `statutory` tone, a declined disabled-contrast exemption — enters the foundation until a module shows it cannot reduce to the cross-product set (info / warning / danger / success). Decided 2026-09-05.

## 1. The frontend-first thesis

**Frontend-first is a sequencing decision, not the product's shape.** A SaaS backend — Postgres via Drizzle on Neon, Better Auth for identity and tenancy — is the destination. We build the product's surface first because the surface is where the product is decided: which screens exist, what each needs to know, what a user can do on it. Written down as a typed contract, those needs become the specification the backend is later built to satisfy, instead of a backend guessing at them.

Four principles follow from that, and every later section is an application of one of them.

1. **One source of truth per fact.** A type, a token, a version, a fixture is defined once and derived everywhere else. When two places must agree, one is generated from the other or a check holds them equal. (This is the lesson v4 paid for: "which components exist" was answered independently six times, and the answers drifted.)
2. **Every boundary is explicit.** Server/client, contract/adapter, design-system/application, vendored/owned. A boundary you cannot point at in the file tree is not a boundary — and where it matters most, Biome enforces it (§3.3).
3. **Verifiable by machine.** The repository is vibe-coded: the human steers from what the agent reports, never from the code. So a report is only trustworthy if every claim in it maps to a check the human can re-run — `pnpm check`, `pnpm typecheck`, `pnpm test`, `pnpm --filter @xforge/web test:e2e`. Architecture that cannot be checked is advice.
4. **Accessibility and performance are architecture, not polish.** Roles-first tests, axe on every screen state, Server Components by default, client code at the leaves, and budgets (§7) are structural choices made now because they cannot be retrofitted cheaply.
5. **Govern what exists.** Measure what matters; promote repetition into vocabulary only after it repeats; promote prose into enforcement only when the enforcement is live and can be shown failing. Every design rule states the tier its check proves — T1 derived-and-required, T2 declared-with-a-reason, or labelled prose — and no T0 is claimed where construction does not make the wrong state impossible (§6.2, ADR-010).

**Non-goals for this phase.** No database, no server endpoints, no authentication, no deployment topology. Each is a deliberate decision that changes `CLAUDE.md` before it changes code (§5.5, §9).

## 2. System context

```
                    ┌──────────────────────────────────────────────────────────┐
                    │                    apps/web  (Next.js 16)                 │
   Browser ◄──────► │  Server Components ──► getDomainSources() ──► adapter    │
                    │  Client leaves ──► Server Actions ──► same interface     │
                    └───────────────────────────────┬──────────────────────────┘
                                                    │ today: fixtures (in-process, server-only)
                                                    │ planned: Drizzle → Neon Postgres
                                                    │ planned: Better Auth (session, organisations)
```

**Verified today:** one Next.js app, one design package, one contract package, no network I/O, no persistence. Every screen renders from in-process fixtures through the contract interface, and every mutation goes back through it. **Planned:** the same screens, the same interface, with adapters that talk to Postgres and an auth session — the seam in the middle is what makes the swap a configuration change (§5).

## 3. Repository architecture

### 3.1 Workspaces and the dependency direction

| Workspace | Package | Role | May depend on | Status |
| --- | --- | --- | --- | --- |
| `apps/web` | `@xforge/web` | The product: routes, screens, features | every `packages/*` | Verified |
| `packages/contracts` | `@xforge/contracts` | Zod schemas, branded ids, `DomainSources` interfaces, executable contract suites, canonical fixtures | `zod` only — **no React, no Next** (Biome-enforced) | Verified |
| `packages/design` | `@xforge/design` | Design system: tokens, primitives, composites, behaviour contracts | `react`, `@base-ui/react`, `cn`, `cva` — **never** an app or a domain | Verified |
| `packages/typescript-config` | `@xforge/typescript-config` | Shared compiler bases (`base` → `library` → `react-library`; `nextjs`) | nothing | Verified |
| `packages/mocks` *(planned, when HTTP exists)* | `@xforge/mocks` | MSW handlers derived from fixtures | `@xforge/contracts`, `msw` | Planned |
| `packages/db` *(planned, §5.5)* | `@xforge/db` | Drizzle schema + the `db` adapter | `@xforge/contracts`, `drizzle-orm` | Planned |

**ADR-001** — pnpm workspaces + Turborepo; dependencies point one way: `apps → packages`, `packages` never import an app, and `packages/design` never imports a domain package. A package that needs to know about the product is in the wrong layer.

**Verified tooling** (all pinned exactly, in `pnpm-workspace.yaml` `catalog:`): pnpm 11.20.0, Turborepo 2.10.12, Next 16.3.4, React 19.2.8, TypeScript 5.9.3, Tailwind 4.3.3, shadcn 4.21.0 on `@base-ui/react` 1.8.0, zod 4.5.4, Biome 2.5.12 via Ultracite 7.10.8, Vitest 5.0.0, Playwright 1.62.1, axe-core/playwright 4.13.0. Compiler bases: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`, `moduleResolution: Bundler` everywhere.

### 3.2 Adding a package — the checklist

1. `packages/<name>/package.json` with `"name": "@xforge/<name>"`, `"private": true`, versions as `catalog:` or `workspace:*`; declare `exports` for every public path (wildcards such as `"./member/*": "./src/member/*.ts"` are fine; a barrel `index.ts` is not — Biome's `noBarrelFile`).
2. Extend the right base in `tsconfig.json` (`react-library.json` for JSX, `library.json` otherwise).
3. Scripts `typecheck` and `test` so Turborepo picks the package up with no `turbo.json` change.
4. Mirror any path alias in the consumer's `tsconfig.json` `paths` **and** the package `exports` — the two must agree.
5. Declare a dependency in the package that *imports* it. shadcn's CLI writes new deps into `apps/web` even when the component lives in `packages/design` (`sonner` did); move them.
6. `pnpm install`, then `pnpm check && pnpm typecheck && pnpm test`.

### 3.3 Lint, format and the enforced boundaries

**ADR-003** — Ultracite on the Biome backend (`biome.jsonc`). The ESLint provider was tried first and replaced the same day: ~60 s per check, 36 dev dependencies, seven provider defects; Biome checks 106 files in ~0.2 s with two. One deprecated setting is kept on purpose (`files.experimentalScannerIgnores: ["node_modules"]`): with zod's typings in the module graph, Biome's type inference took ~20 s per check; the documented replacement (`!!**/node_modules` in `includes`) was measured not to have the same effect.

Three overrides turn principle 2 into lint errors:

- `packages/contracts/**` may not import `react`, `next`, `server-only` or any app path — the contract stays framework-blind.
- `apps/web/{app,components,features}/**` may not import `@/lib/data/adapters/*` or `@xforge/contracts/fixtures/*` — data is reached only through `getDomainSources()`.
- `packages/design/src/components/**` keeps shadcn's upstream style (namespace React import, unsorted cva maps, a few suspicious/a11y rules off) so `shadcn diff` stays meaningful; hand-written composites beside them follow the house style.

The `.claude/settings.json` hook runs the single-file fix after every agent edit; it decides nothing and blocks nothing.

## 4. Application architecture — `apps/web`

### 4.1 Routing and folders — as built

```
apps/web/
  app/
    (marketing)/page.tsx        landing → "Open demo workspace" → /acme
    (auth)/sign-in/page.tsx     stub card until Better Auth; no fake form
    (app)/
      not-found.tsx             "Workspace unavailable" — never echoes the slug; catches notFound() from the layout below
      [orgSlug]/
        layout.tsx              validates the slug with the contract schema, resolves the tenant through getDomainSources(),
                                notFound() on NotFound, renders AppShell + Toaster
        page.tsx                overview — two reads started together
        members/
          page.tsx              parse URL → filter, Promise.all([members.list, organizations.getBySlug]) → screen
          loading.tsx           skeleton table
          error.tsx             'use client' boundary with reset — reached only by unexpected failures
    layout.tsx · not-found.tsx  root: fonts, ThemeProvider, metadata template; generic "Page not found"
  features/members/
    filter.ts                   parseMemberListQuery(searchParams) → MemberFilter; memberListQueryString(filter)
    queries.ts                  listMembers(organizationId, filter) via getDomainSources()
    actions.ts                  'use server': inviteMember, updateMemberRole, removeMember → ActionResult
    components/                 members-table, members-empty-state, members-pagination (server);
                                members-filters, member-row-actions, invite-member-dialog ('use client' leaves)
  components/app-shell/         app-shell, page-header (server); sidebar-nav ('use client': usePathname)
  components/theme-toggle.tsx   'use client': useTheme — the d hotkey's visible twin
  lib/data/                     index.ts (server-only; DATA_SOURCE switch) · adapters/fixtures/{store,source,faults,index}
  lib/actions/result.ts         ActionResult<T> and toActionResult()
  tests/ · e2e/                 Vitest (*.test.tsx) · Playwright (*.e2e.ts) + axe.ts
```

**Placement rule.** Used by exactly one route → that route's `_components/` (none yet). Belongs to a domain and more than one route → `features/<domain>/components/`. Knows nothing about the domain → a design-system candidate, but a component enters `packages/design` only when a screen uses it (§6.4).

### 4.2 The server/client boundary

Everything in `app/` is a Server Component unless it says `'use client'`. The working rule (from `.claude/skills/nextjs-16/references/boundary.md`):

- `'use client'` **only** when the component has state, an event handler, an effect, or a browser API — and it goes on the **leaf**, never on a page or layout. **Verified:** six client files, all leaves (theme provider, sidebar nav, filters, row actions, invite dialog, the members error boundary).
- Context providers are client components that take `children` and are rendered from a server layout; the subtree inside stays server.
- `lib/data/index.ts` imports `server-only`. Nothing under `lib/data/` is imported from a `'use client'` file; importing it under jsdom throws, which is the test suite's reminder to mock at the boundary.

### 4.3 Rendering and caching

**ADR-008** — `cacheComponents` stays **off** until the first screen renders real (non-fixture) data. Next 16.3 makes it opt-in and plans to default it in a future major; it changes two things we cannot yet reason about on fixtures: data becomes dynamic-by-default with `use cache` opt-ins, and client navigation switches to React `<Activity>` — the previous route is hidden, not unmounted. Enabling it is step 6 in §9. Until then: the previous model, Suspense boundaries with `loading.tsx`, and `error.tsx` per domain.

### 4.4 Data flow inside a screen — as built

```
   Route page.tsx (Server Component)
     │  await Promise.all([params, searchParams]) → parseMemberListQuery()
     │  await Promise.all([sources.members.list(org.id, filter), sources.organizations.getBySlug(slug)])
     ▼
   Screen (Server Components: MembersTable, MembersPagination, MembersEmptyState)
     │  plain props
     ▼
   Leaves ('use client'): MembersFilters (writes searchParams), InviteMemberDialog (useActionState),
                          MemberRowActions (startTransition + toast)
     │  { orgSlug, memberId, … } — never an organization id
     ▼
   Server Action: parse → organizations.getBySlug(orgSlug) → members.<op>(organization.id, …)
                  → revalidatePath → ActionResult
```

- **Reads** happen in Server Components through the contract; independent reads start together.
- **The URL is the state store** for anything shareable: `?query=&role=&status=&page=&pageSize=`. `parseMemberListQuery` is the named boundary between the user-editable URL and the domain filter: invalid values normalise to defaults (`?page=abc` → 1, `?pageSize=999999` → 25), repeated keys take the first value. Bounds live in the zod schema, once.
- **Mutations** are Server Actions that resolve the tenant server-side (rule 2, §5.4) and return an `ActionResult` (ADR-011). Forms use `useActionState` and the contract's zod schema — no form library; the smallest form in the application does not justify one.
- **Five states, five mechanisms** (ADR-012):

| State | Mechanism | Proven by |
| --- | --- | --- |
| Loading | `loading.tsx` / Suspense | build + navigation |
| Empty | domain UI (`MembersEmptyState`) | e2e `/blank-co/members` |
| Populated | domain UI | e2e `/acme/members` |
| Resource absent | `notFound()` → `(app)/not-found.tsx` | e2e `/nope` (404, slug never echoed) |
| System failure | `throw` → `error.tsx` with reset | e2e `/glitch/members` under `FIXTURE_FAULTS` |
| Expected mutation failure | `ActionResult` → field error or toast | e2e duplicate email, last-owner removal |

## 5. The contract and data seam

This is the section that makes frontend-first work. Everything else is ordinary Next.js.

### 5.1 The contract — `@xforge/contracts` (Verified)

```
packages/contracts/src/
  ids.ts              branded OrganizationId, MemberId, OrganizationSlug — tenant scope is a type, not a string
  errors.ts           DataSourceError { code: NotFound | Conflict | Validation | Invariant }
  sources.ts          DomainSources = { organizations: OrganizationSource; members: MemberSource }
  organization/       schema · types · source (getBySlug) · contract (executable suite)
  member/             schema (Member, InviteMemberInput, UpdateMemberRoleInput, MemberFilter, MemberPage)
                      · types · source (list · invite · updateRole · remove — every one takes organizationId)
                      · contract (executable suite)
  fixtures/           seed (deterministic ids/dates) · organizations · members · factory
```

**ADR-005** — contract-first, but not future-first: the seam exists before implementation, and only for capabilities a screen observes. `members.get`, `organizations.list/create` arrive with the screens that need them, with contract tests in the same commit.

One zod definition yields the TypeScript type, the form validator, the URL parser's bounds, the fixture shape and — when HTTP arrives — the request/response validation. Principle 1, applied to data.

### 5.2 Adapters

| Adapter | Where it runs | Backed by | Status |
| --- | --- | --- | --- |
| `fixtures` | server only — RSC, server actions, Vitest, Playwright's dev server | `createFixtureStore()`: deep-copied maps from the canonical fixtures; all tenant checks and invariants in the adapter | **Verified** — passes both contract suites |
| `db` | server only | Drizzle → Neon Postgres | *planned* (§5.5); `DATA_SOURCE=db` already throws "not implemented" |
| `http` | client (TanStack Query) | Route Handlers / server functions that themselves call `db` | *planned*, when a screen needs live client data |

`apps/web/lib/data/index.ts` selects by `DATA_SOURCE` and is the **only** module that knows adapters exist. `createFixtureDomainSources(options)` is always a fresh, isolated instance — tests build one per case; `getFixtureDomainSources()` is the dev-only `globalThis` singleton that survives HMR. **Fault injection is an adapter concern, never a fixture:** `FIXTURE_FAULTS=members.list@glitch` makes one operation throw for one workspace, which is how the error state is driven in dev and e2e; the fixtures themselves describe only valid domain state.

The contract suites (`runOrganizationContract`, `runMemberContract`) run against the fixture adapter today (`lib/data/adapters/fixtures/source.test.ts`); the `db` adapter must pass the same suites — the fixtures are the executable specification, not a toy.

### 5.3 Why in-process adapters, and where MSW fits

The obvious alternative is HTTP-first: RSCs `fetch` an API that MSW mocks — what v4 did. We did not do that first, for three reasons: there is no transport to mock yet (Route Handlers, server functions or an RPC layer is undecided, and committing to HTTP shapes now decides it by accident); RSC + MSW is workable but not free (`msw/node` from `instrumentation.ts`, `fetch` patching that has needed fixes on both sides, unhandled requests aborting); and the contract is the source of truth, not the wire format.

MSW enters the moment HTTP exists — client fetches, or an e2e that must see network failures — and its handlers are **generated from the same fixtures** (`packages/mocks`), so the browser and the server never disagree about the data. Until then Playwright's network needs are met by the fault harness and `page.route()`.

### 5.4 Contract rules (Verified — each is a test or a lint error)

- **Tenant scope is part of the operation, not an optional filter** (ADR-009). Every member operation takes `organizationId`; a member outside it is `NotFound`, never "found elsewhere". Server actions take `orgSlug` from the client and resolve the organisation themselves; an organisation id from the client is never trusted.
- **Invariants live in the contract suite:** email unique within an organisation (`Conflict`, and the same email may exist in two organisations); an organisation always keeps ≥ 1 active owner (`Invariant` on removing or demoting the last); invited members join as `invited`; pagination bounds honoured and `total` counts the filtered set.
- Screens never import fixtures or adapters directly (Biome); fixture factories are seeded and deterministic; no real personal data — names and `.example` emails are synthetic.
- A schema change is a contract-test change in the same commit.

### 5.5 When the backend lands — the playbook

*Planned.* The decision is the human's; the mechanics are known:

1. **Identity — Better Auth.** `auth.ts` on the server; the handler at `/api/auth/[...all]`; the `nextCookies` plugin because Server Components cannot set cookies. In RSC and layouts: `auth.api.getSession({ headers: await headers() })`. In client leaves: `authClient.useSession()`.
2. **Tenancy — the `organization` plugin.** `(app)/[orgSlug]` already carries the tenant; the layout resolves the slug to an organisation the session may access, and every adapter call already receives the organisation id. The sequence becomes: URL slug → resolve organisation → authenticate actor → authorise actor for organisation → domain operation → adapter.
3. **Persistence — Drizzle on Neon.** `packages/db` holds the schema; the `db` adapter implements each source and passes the contract suites against a Neon branch in CI; `@better-auth/cli generate` emits the auth tables into the same schema; migrations through `drizzle-kit`. Row-level security is defence layer two — the application contract already encodes tenant scope.
4. **Flip `DATA_SOURCE=db`** for production; keep `fixtures` for Vitest and any environment without a database.
5. **Then** revisit `cacheComponents` (§4.3) with real latency to reason about.

## 6. Design system architecture — `packages/design`

### 6.1 Layers

```
tokens        globals.css: @theme inline over oklch CSS variables (light + .dark), radius scale, fonts
   ▼
primitives    shadcn/ui on Base UI (style base-nova) — avatar, badge, button, card, dialog, dropdown-menu, field, input,
              label, select, separator, skeleton, sonner, table — generated by the CLI, styled by tokens
   ▼
composites    (none yet — one arrives with the second independent screen that repeats a structural arrangement with
              materially the same semantics: header, toolbar, content region and its states — not with a repeated gap-6)
   ▼
feature UI    apps/web/features/<domain>/components — knows the domain, uses only the layers above
   ▼
screens       apps/web/app/**/page.tsx — composition only; no styling decisions of its own
```

**ADR-004** — shadcn/ui on **Base UI** (`@base-ui/react` 1.8.0, shadcn's default base since July 2026). The scaffold started on Radix and was migrated the same day, per component through the `migrate-radix-to-base` skill (golden pair via the CLI; reports in `.migration/`). The three behaviour contracts passed unchanged; the one runtime delta — a menu label must sit inside a group — is recorded in `.migration/dropdown-menu.md`. Consumer idioms are now `render` (never `asChild`), `onClick` on menu items, nullable `Select.onValueChange`, and `items` on selects for server-rendered labels.

### 6.2 Token rules

- **Two concepts, one contract (ADR-013).** Light is *Ledger* — warm paper (hue 85) where colour is pigment; dark is *Console* — a cool chassis (hue 264) where colour is emission and surfaces gain chroma as they rise. Same token names, different physics: `muted` sits below the ground in light and above it in dark; the sidebar is a margin (lighter) in light and a bezel (darker) in dark. Every value, its derivation and the declined M3 features are in `docs/color-system-v2.md`; stage 1 (re-value only) landed 2026-09-05, stage 2 (new tokens, each with its consumer) is pending a decision on editing generated components. Three checks came with it: **R8** — every declared adjacent fill pair (accent/muted, accent/secondary, secondary/muted, card/background, popover/card, sidebar/background) is at least 0.015 apart in Oklab, which a contrast ratio cannot see and which was 0.000 for three pairs before; **R9** — every declared oklch is inside sRGB, so the measured colour is the rendered one (the shadcn default red was not); **R10** — a `prefers-reduced-motion` block collapses every animation and transition, pinned by `tests/motion.test.ts`.
- Colour, space, radius and type come from `@theme` tokens; components use semantic utilities, never a hex or an arbitrary value. Biome's `useSortedClasses` knows `cn` and `cva`.
- A missing or wrong value is fixed in `globals.css` — `:root`, `.dark` and `@theme inline` in the same edit — not worked around at the usage site. **Verified example:** axe found muted text on `bg-muted` (avatar fallbacks) at 4.34:1; the fix was `--muted-foreground` to `oklch(0.52 0 0)`, once, not a class on the avatar.
- Ink goes on things with text; fills on things without. A value used by two components is one token.
- **Colour is a pair.** `x` carries `x-foreground` (M3's container / on-container). Every declared pair is measured in both themes by `packages/design/tests/tokens.test.ts` (R1): 4.5:1 for text — one floor, large text included; the exemption arrives with a consumer — and 3:1 for boundaries. `--border` is the decorative outline-variant and is exempt with its reason in the test. A new tone enters as `--x` + `--x-foreground` in both blocks, in the commit with its first consumer (R7); `statutory` is not minted (§1). An ad-hoc ink-on-fill at a call site is constrained by the vocabulary scan (R3), not proven — that residue is prose.
- **Three boundary tokens, three jobs.** `--input` is the interactive boundary (3:1 against background and card); `--ring` is the focus indicator, an alias of `--primary`, measured at the `/50` alpha base-nova draws against background, card and popover; `--border` is decorative. They were one grey in the shadcn default — measured 2026-09-05 at 1.26:1 (input), 1.54:1 (ring as drawn) and 3.99:1 (light destructive soft fill) — and must never be the same grey again.
- **States are upstream's, and each is measured.** Base-nova ships three hover mechanisms in one button — alpha on the fill (`hover:bg-primary/80`), a swap to a sibling pair (`hover:bg-muted hover:text-foreground`), and 5% of the ink mixed in (`color-mix`, secondary) — and principle 5 keeps them. R1 measures the pairs they produce: primary/80, destructive/20 (the soft destructive hover was 3.86:1 in light until 2026-09-05), foreground on muted, the invalid border, the shell's ink and eyebrow on the sidebar, and the field boundary and focus ring on every ground. Two exemptions with reasons in the test: the `color-mix` hover (outside the parser) and the invalid ring (the second indicator beside a solid border). Press is geometry (`active:translate-y-px`); focus is `border-ring` + `ring-3 ring-ring/50`, two indicators; disabled is `opacity-50` and unmeasured — WCAG's exemption taken, revisited with the first disabled field carrying a consequential value. No `*-hover`, `*-pressed` or `*-focus` tokens; M3's content-colour overlay and v4's opaque fills are both declined, here, with this paragraph as the reason (R6).
- **Every projected token has a statically discoverable consumer** — a class in `apps/**` or `packages/design/src/**`, or `globals.css` itself via `@apply` or `var()` — or a declared exemption with a reason (R4). Twelve consumer-less tokens (`--chart-*`, seven `--sidebar-*`) were deleted 2026-09-05.
- **Fonts are wired by name.** `next/font` sets `--font-geist-sans` and `--font-geist-mono`; the `@theme inline` bridge aliases them. The bridge may hold no self-reference or cycle (R5, same test file) — `--font-sans: var(--font-sans)` resolved by cascade accident until 2026-09-05.
- **The language is data, and Level 2 is held equal to it (R11, R12).** Level 1 (`packages/design/src/foundation/`, ADR-014) enumerates its public semantics as TypeScript data; `packages/design/tests/language.test.ts` proves every one has a Level-2 resolution — each colour role in the default block of `color.css`, each typography role across its five required properties, each geometry and motion identity, and each role's Tailwind projection (R11) — and that the ADL stylesheet graph is wired: every relative `@import` resolves, every sheet is reachable from `index.css`, and every `var(--af-*)` is defined in the graph or is a declared input carrying a fallback at every use (R12). This is the check-holds-equal half of principle 1, taken instead of a value-generation layer (ADR-015). Minted 2026-09-05, after `index.css` imported `tokens.css` while the file on disk was `token.css` and nothing failed.
- **The ADL schemes are measured, and the language holds its own integrity (R13, R14).** R13 (`packages/design/tests/schemes.test.ts`) is the ADL twin of R1/R8/R9: across all six schemes (light/dark × standard/medium/high contrast) every text pair *derived from the roles themselves* holds 4.5:1 — deriving rather than hand-listing is what caught `on-primary-fixed-variant` at 3.85:1 on the dim tone the hand-list missed — outline, focus and error boundaries hold 3:1 on every surface, hovered fills stay legible under the 4% state layer, data marks clear 3:1 with monotonic sequential ramps, ladder steps stay 0.015 apart in Oklab, and every reference oklch is inside sRGB. One structural waiver, ratcheted at its measured 0.0095 and refused the moment it clears the floor: `surface-container-lowest` vs `-low`, because only 0.0188 of headroom exists between white and the ground. The measurements it minted with: the light ladder re-stepped (`high`/`highest` to slate-93/slate-90), categorical-8 moved to a plum family in both themes (teal could not clear 3:1 and stay tellable from categorical-1), `on-primary-fixed-variant` to blue-40. R14 (`language.test.ts`) holds the language to itself: every domain identity block equals its registry row in `00-principles`, and every `AF-*` rule ID across the foundation — `10-components/*` included — matches the grammar and is defined exactly once; its planted defect replays the day `05-layout.ts` was a copy of `04-geometry.ts` carrying all 104 `AF-GEO` rules twice.
- **A block is held equal to its contract (R15).** `packages/design/tests/blocks.test.ts`: for every `foundation/10-components/<name>.ts` contract, the block in `src/blocks/<name>/` stamps exactly the declared anatomy, implements exactly the admitted variants and sizes, draws exactly the admitted colour roles — both directions, so the admitted list cannot rot — names behaviour rules that exist, keeps its `AF-CMP-<CODE>` rules inside the grammar, and points at a live exemplar that uses the block; contracts and blocks are paired both ways, so neither can exist alone. A block is **defined, not rendered**: its folder carries `manifest.ts` — base, variants and sizes as ADL utility literals plus the slot identity — and `index.tsx` derives every class from that data; a `data-slot` string literal in a render is itself a finding. Minted 2026-09-05 with Button, the first block: state-layer hover via the `state-layer-*` utility, af-interactive for focus/disabled/invalid, semantic geometry throughout. Two build facts landed with it: the class-bearing ADL sheets moved into `layer(components)` (an unlayered `.af-interactive` beats every utility a block composes with it), and the ADL's theme wipe narrowed to `--color-*: initial` in its own `@theme` block — the wildcard wipe had killed the ADL's own tokens (the formatter sorts a shared block) and forced the bridge to resurrect Tailwind defaults piecemeal.
- **A contract's statically shaped must-rules hold at every call site (R16).** `apps/web/tests/design-vocabulary.test.ts` extracts every `<Button …>` opening tag in `app/`, `components/` and `features/` (brace-aware, so a nested element inside `render={…}` cannot truncate the read) and enforces the two `common-button` rules with a static shape: an icon-only size carries `aria-label` or `aria-labelledby` (AF-CMP-COMMON-BUTTON-002 — axe's button-name rule only sees the screen states the e2e visits; this sees every source line), and no Button takes `render={<Link />}` or `render={<a />}` (AF-CMP-COMMON-BUTTON-004). The rules without a static shape — one default-variant per region (001), destructive acts use the destructive variant (003) — stay review-enforced prose per the register's grammar. A third check refuses superseded vendored imports in app code (`@xforge/design/components/button` once the block exists — the twin exports the same names, so an auto-importer offers either); the vendored layer may keep importing its own until each component becomes a block. Minted 2026-09-05 off the Base UI accessibility page's hand-off list; its first run over the real tree caught the two pagination link-buttons the rule-004 rewrite had missed — in the contract's own exemplar.
- Dark mode is `data-theme="dark"` set by `next-themes` (`attribute="data-theme"`), declared to Tailwind by the ADL's `@custom-variant dark`; `data-contrast` and `data-density` ride the same mechanism.
- **The ADL is the compiled system (2026-09-05).** `apps/web/app/globals.css` is the app's only stylesheet: it imports the canonical `@xforge/design/styles/index.css`, provisions next/font into the ADL reference tier, and carries the transitional shadcn bridge — legacy vocabulary aliased onto ADL roles (every pair transitively measured by R13), deleted line by line as `10-components/*` rewrites each component. The legacy `globals.css` and its guards retired with it: R1/R8/R9's subjects are now measured by R13, R5 and R10 moved with the bridge into `apps/web/tests/design-vocabulary.test.ts`, and R4 now scans the bridge. The paragraphs above describing `tokens.test.ts` and the ADR-013 values document that era's decisions and measurements.
- Numeric columns set `tabular-nums` — the pagination already does; every count or currency column follows.
- Icons are `lucide-react`, recorded as a decision rather than left decided by omission; Material Symbols' grade and optical-size axes are not taken.

### 6.3 Composition rules

- **No boolean-prop proliferation.** Behaviour is composed from parts, not switched on. **Compound components share context**; the provider is the only place that knows how state is managed. **Children over render props**; `cva` for the variant axes a primitive genuinely has. **React 19**: `ref` is a prop; `use()` over `useContext()`.
- **Behaviour contracts** live in `packages/design/tests/`: Dialog moves focus inside, closes on Escape and returns focus to the trigger; DropdownMenu opens from the keyboard, arrows move, Escape closes and restores focus; Field marks the input invalid and associates the error text as its accessible description. Axe cannot prove these; the tests do.
- **Parts are `data-slot` names, and every part has a class.** The anatomy of a component is discovered from the slots it stamps — 73 names on 12 components — and pinned in `packages/design/tests/anatomy.test.ts` (R2), so a regenerated component that gains or loses a part is a one-line reviewed diff. `packages/design/src/anatomy.ts` is the vocabulary as data: ten closed classes from M3's grammar (container, label, supporting, action, indicator, divider, scrim, media, icon, structural), what each may draw, and the class of every slot. R2 refuses a slot without a class, a class outside the list, a divider that draws a target boundary (`--input`, `--primary`, `--ring`) and the field boundary on anything but a container or indicator — each with a planted defect. `badge` and `sonner` stamp none and say why in the same file. What stays prose: that a label is its container's on-partner is true by upstream construction and no cheap static check follows a class string to the element it colours.

### 6.4 What enters the design package

A component enters `packages/design` when a screen uses it and it knows nothing about the domain — not before. shadcn components are added with `pnpm dlx shadcn@4.21.0 add <name> -c apps/web --overwrite` and land in `packages/design/src/components/`; hand-written composites sit beside them and follow the house style.

## 7. Quality architecture

### 7.1 The gates (Verified, 2026-09-05)

| Gate | Command | Timing | Runs |
| --- | --- | --- | --- |
| Lint + format | `pnpm check` | ~0.2 s (106 files) | every edit (hook) and before any claim of done |
| Types | `pnpm typecheck` | ~12 s, 3 packages | before done |
| Unit | `pnpm test` — 91 tests (contracts 12, design 27, web 52) | ~30 s | before done |
| Browser | `pnpm --filter @xforge/web test:e2e` — 13 tests in Chromium and WebKit, plus Firefox in CI (35 runs there): axe on every screen state, a phone viewport, and Core Web Vitals and JavaScript budgets (`e2e/vitals.e2e.ts`, Chromium-only) against a production build | ~2 min incl. build + start | per screen path |
| Build | `pnpm build` | ~15 s | before done |
| CI | `.github/workflows/ci.yml` — all of the above against a production build | on push and PR | always |

### 7.2 Test doctrine (`.claude/skills/xforge-testing`)

Two runners split by filename — `*.test.tsx` renders under Vitest, `*.e2e.ts` drives the browser. Roles first; `user-event`, never `fireEvent`; `afterEach(cleanup)` registered explicitly. Mock at the boundary: component tests mock the domain's `actions`, action tests mock `@/lib/data` with a fresh fixture instance. Fixture workspaces have roles (acme counted, orbit mutable, northwind single-owner, glitch faulted, blank-co empty) so parallel runs never share state.

### 7.3 Definition of done for a screen (applied to `/[orgSlug]/members`)

- All five states rendered and tested; expected mutation failures rendered as `ActionResult`.
- One Playwright path through each primary action, with `expectNoSeriousViolations(page)`.
- No token added outside `@theme`; no `'use client'` above a leaf; reads parallelised.
- `pnpm check`, `typecheck`, `test`, `build`, e2e green — and the report says so, with the commands it ran.

### 7.4 Budgets — *in force, enforced in CI*

- Core Web Vitals: **in force** — `e2e/vitals.e2e.ts` injects `web-vitals` before navigation on `/` and `/acme/members` (the heaviest screen) and asserts LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 against the production build.
- Accessibility: **in force** — axe (`@axe-core/playwright`, WCAG 2.2 AA tags) with zero serious/critical violations per screen state.
- Bundle: **in force** — the same spec budgets the JavaScript transferred per route (measured baseline plus headroom; the numbers live in the file). Exceeding it fails CI; raising it needs a sentence in the PR. `pnpm analyze` opens Turbopack's `next experimental-analyze` treemap; `@next/bundle-analyzer` is Webpack-only and not installed.
- Coverage: **in force** — `pnpm test:coverage` (`@vitest/coverage-v8`, text + lcov) is its own Turbo task with `"outputs": ["coverage/**"]`; the plain `test` task is unchanged.

### 7.5 Performance rules in force

Eliminate waterfalls (`Promise.all`, Suspense boundaries), import directly rather than through barrel files, `next/dynamic` for heavy client components, load third-party scripts after hydration, derive state during render rather than in effects, keep interaction logic in event handlers (the members filter debounces in its handler, not an effect).

## 8. Security and privacy posture

- `lib/data/index.ts` imports `server-only`; a client import fails the build rather than leaking at runtime. Tenant scope is resolved on the server from the URL (§5.4).
- No secrets in the repository; `.env*` is ignored (`.env.example` is whitelisted); Turborepo's `build` hashes `.env*`.
- Fixtures are synthetic (§5.4). The not-found page never echoes the requested slug, so "does not exist" and "exists but not yours" read the same once authentication arrives.
- When Better Auth lands: `trustedOrigins`, rate limiting, versioned cookie cache; the `security.md` checklist in the `better-auth` skill is the gate.
- Supply chain: exact pins, pnpm's `minimumReleaseAge` policy, install scripts blocked except the allow-listed.

## 9. Evolution — ordered, each a deliberate step

1. ~~**Contract package**~~ — done 2026-09-05 (`8253312`): `packages/contracts`, fixture adapter, contract tests.
2. ~~**First screens on fixtures**~~ — done 2026-09-05 (`0e1a301`, `cdf96be`, `9400dbf`): shell, route groups, members read and mutation slices, five states, axe, CI.
3. ~~**Base UI decision**~~ — done 2026-09-05: all eight Radix wrappers migrated to Base UI, Radix removed.
4. **Client server-state** — TanStack Query when the first live/optimistic screen appears.
5. **Backend** — Better Auth + organisations, Drizzle + Neon, `db` adapter; `DATA_SOURCE=db` (§5.5).
6. **Cache Components on** — with real latency to reason about; audit for `<Activity>` navigation assumptions.
7. **Hardening** — ~~CWV and bundle budgets, coverage~~ done 2026-09-05 (§7.4), plus a visible theme toggle and a responsive shell; ~~multi-browser Playwright~~ done the same day (Firefox in CI); still open: TypeScript 7 once the toolchain is validated against it.
8. **DTCG token export** — on the first independent machine-readable consumer outside the CSS build path (a Figma sync, a native client, a token export); the pair test already consumes the CSS and does not count.

## 10. ADR register

| ADR | Decision | Status | Consequence |
| --- | --- | --- | --- |
| 001 | pnpm workspaces + Turborepo; `apps → packages` only | Accepted | New shared code is a package with `exports`; no app imports from another app |
| 002 | Next.js 16 App Router on Turbopack; Server Components by default | Accepted | `'use client'` at leaves; providers wrap `children` |
| 003 | Ultracite on Biome (replaced the ESLint provider) | Accepted | One `biome.jsonc`; sub-second checks; boundaries as lint errors |
| 004 | shadcn/ui on Base UI (migrated from the Radix scaffold per component) | Accepted, implemented | `render` not `asChild`; menu labels inside groups; nullable select values |
| 005 | Contract-first, not future-first: zod contract, `DomainSources` interface, fixture adapter now, `db`/`http` later; only observed capabilities | Accepted, implemented | Screens never see adapters; new capabilities arrive with the screen and its contract tests |
| 006 | Test runners split by suffix: `*.test.tsx` Vitest, `*.e2e.ts` Playwright on port 3100 | Accepted | No `.spec.ts` files; roles-first queries; axe per screen state |
| 007 | Exact version pins via the pnpm catalog; `saveExact` | Accepted | Bumps are one-line catalog edits |
| 008 | `cacheComponents` off until real data exists | Accepted | Previous caching model; revisit at step 6 |
| 009 | Tenant scope in every operation; server resolves the tenant from the URL; backend = Better Auth (organisations) + Drizzle + Neon behind the same contract | Accepted; backend not implemented | `[orgSlug]` in the URL; `organizationId` on every source method; RLS is layer two |
| 010 | The spine without the generator: M3's parts / pairs / state vocabulary governed by five live checks (R1–R5, each with a planted-defect proof) over the shadcn-generated package; manifest → generated components rejected for the current scale, not permanently; DTCG deferred; `className` stays | Accepted, implemented 2026-09-05 | Generator only when the same class of drift recurs, R1–R4 cannot catch it economically, it costs review time, and generation would remove it; DTCG on the first machine-readable consumer outside the CSS build path; one 4.5:1 text floor; `statutory` not minted; lucide; `tabular-nums` on numeric columns |
| 010 | TanStack Query for client server-state | Proposed | Installed only when a screen needs it; SWR is the fallback if bundle size dominates |
| 011 | Server actions return `ActionResult`; expected outcomes are values, unexpected failures throw | Accepted, implemented | UI understands SUCCESS / FIELD ERROR / CONFLICT / INVARIANT / NOT_FOUND; `error.tsx` sees only operational failures |
| 012 | Five states, five mechanisms; fault injection is an adapter concern, never a fixture | Accepted, implemented | Every screen ships all five with a test; fixtures stay valid domain state |
| 013 | Colour system v2 — two concepts, one contract: Ledger (warm paper, pigment) and Console (cool chassis, emission) through the same token names; elevation as a tonal ladder; `secondary`/`muted`/`accent` split; R8 fill separation, R9 gamut, R10 reduced motion | Accepted, stage 1 implemented 2026-09-05 | Stage 2 tokens (`--destructive-foreground`, `--success`, `--warning`, `--sidebar-foreground`, `--scrim`) each arrive with a consumer, once editing generated components is decided; `--ring` stays an alias of `--primary`, which pins primary dark in light and bright in dark; contrast levels, tertiary, fixed accents, tonal palettes and five surface containers declined with reasons in `docs/color-system-v2.md` §5 |
| 014 | The design language as data: Level 1 (`packages/design/src/foundation/`) is normative TypeScript data — principles, taxonomies, `AF-<CODE>-<NNN>` rule IDs, public APIs, provenance dispositions — holding no literal value; Level 2 (`src/styles/`) realises it, Level 3 proves it | Accepted, implemented 2026-09-05 | M3 is the spine, adopted/adapted/rejected/deferred per concept; six context axes; `10-components/` pending; R11/R12 hold Level 2 equal to the Level-1 data |
| 015 | Physical values stay hand-authored CSS: no `values/` data layer, no generated token CSS | Accepted 2026-09-05 | Level 1 is banned from holding literals, so a generation source would be a second physical truth with no consumer today; completeness is a check instead (R11/R12); values become data and CSS becomes projection on the first machine-readable consumer outside the CSS build path (tenant palette generation, a native client, DTCG export) — in one move, with the consumer in hand |
| 016 | Governed components are **blocks**: `packages/design/src/blocks/<name>/` (one folder per component, variants inside, `index.tsx` the public surface), consumed as `@xforge/design/blocks/<name>` | Accepted 2026-09-05 | `src/components/` is the shadcn CLI's write target and a refresh may overwrite any file in it — deliberately, so `shadcn diff` stays meaningful — which is why governed code cannot live there; a block lands with its `foundation/10-components/<name>.ts` contract, writes ADL vocabulary only, retires its shadcn-bridge lines from `apps/web/app/globals.css` (R4 confirms), and is held equal to its contract by R15, minted with the first block |
| 017 | Strict CSP with Base UI's `CSPProvider` — deferred to the auth/hardening phase (§5.5), not silently ignored | Deferred 2026-09-05 | The exposure is real today: `select.tsx` defaults `alignItemWithTrigger`, so Base UI injects an inline `<style>` tag (`.base-ui-disable-scrollbar`) the moment a select opens — under a future `style-src-elem 'self'` it breaks silently, and no CSP exists yet (no middleware, no headers). The flip, in one commit with the CSP header itself: either middleware generates a per-request nonce → header (`script-src`/`style-src-elem` `'nonce-…'`) → the root layout reads it and wraps providers in `<CSPProvider nonce>`; or `<CSPProvider disableStyleElements>` plus the six-line scrollbar rule shipped in the ADL graph, which needs no style nonce at all (inline `<script>`s are opt-in and none are used). Inline `style=""` attributes are a separate directive (`style-src-attr`) — relax it or unset the affected inline styles per component when the header is written |
| 018 | RTL behaviour with Base UI's `DirectionProvider` — deferred to the first RTL locale, not silently ignored | Deferred 2026-09-05 | The ADL's `direction` axis is half-live: the CSS half already works everywhere (logical properties throughout, `--af-motion-inline-direction` flips on `[dir="rtl"]`, `.af-icon-directional` mirrors via `:dir(rtl)`), but Base UI reads direction from React context and defaults `ltr` regardless of the DOM — under an RTL document without the provider, menu arrow keys, slider direction and popup alignment behave backwards, silently. Today the app is single-locale (`<html lang="en">`, no `dir`), so the LTR default is correct and a provider would be inert. The flip, in one commit with the first RTL locale: the layout derives `dir` from the locale onto `<html>`, `<DirectionProvider direction={dir}>` wraps the providers beside ThemeProvider, and `data-script` joins for the typography metrics context (03-typography's script adaptations). The doc's named trap: portaled parts rendered outside the root are unaffected by the `dir` attribute — they read `useDirection` |

## 11. Open questions

- **Transport for `http`** — Route Handlers, Next server functions, or an RPC layer (oRPC/tRPC) that can also serve a future mobile client. Decide before `packages/mocks` is generated; the contract does not care.
- **Product domain and next screens** — the workspace core is built; the next domain names the next `packages/contracts` module.
- **Tenant URL shape** — `/[orgSlug]/…` is in code; subdomains remain possible (Better Auth's organisation plugin supports both) but would need a proxy and wildcard DNS in every environment.
- **Design-system governance** — v4 grew a token bridge and an adapter file schema with generated manifests. Whether v5 needs that machinery is decided by evidence as domains multiply, not up front.

## Sources

- Next.js — [cacheComponents](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents), [project structure](https://nextjs.org/docs/app/getting-started/project-structure), [client-side data fetching](https://nextjs.org/docs/app/guides/client-side-data-fetching), [TanStack Query guide](https://nextjs.org/docs/app/guides/client-side-data-fetching/tanstack-query), [error handling / not-found](https://nextjs.org/learn/dashboard-app/error-handling), [mutating data with Server Actions](https://nextjs.org/learn/dashboard-app/mutating-data)
- shadcn/ui — [July 2026: Base UI as the default](https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default), [January 2026: Base UI documentation](https://ui.shadcn.com/docs/changelog/2026-01-base-ui); npm `@base-ui/react` 1.0.0 (2025-12-11) → 1.8.0 (2026-09-04), verified
- Better Auth — [Next.js integration](https://better-auth.com/docs/integrations/next), [getSession in RSC with cookie cache (#7008)](https://github.com/better-auth/better-auth/issues/7008), [multi-tenant setup discussion](https://github.com/better-auth/better-auth/discussions/3317)
- MSW + Next.js — [Next.js 16 × MSW integration demo](https://github.com/laststance/next-msw-integration), [E2E with Next.js, Playwright and MSW](https://safedep.io/end-to-end-test-nextjs-msw-playwright/), [mocking client- and server-side requests](https://www.ajth.in/blog/msw-with-playwright-nextjs/)
- Data-layer patterns — [structuring a data access layer in Next.js](https://medium.com/@samrose.mohammed/structuring-your-data-access-layer-in-next-js-patterns-that-actually-scale-2e4c07491866), [contract-first development](https://developers.redhat.com/blog/2020/04/28/contract-first-development-create-a-mock-back-end-for-realistic-data-interactions-with-react), [BFF pattern in Next.js](https://dev.to/behnamrhp/nextjs-and-bff-architecture-the-missing-piece-in-modern-fullstack-apps-5al7)
- Client data libraries — [TanStack Query vs SWR vs Apollo, 2026](https://www.pkgpulse.com/guides/tanstack-query-vs-swr-vs-apollo-2026)
- Installed skills applied: `nextjs-16`, `xforge-testing`, `vercel-react-best-practices`, `vercel-composition-patterns`, `tailwind-design-system`, `msw`, `better-auth`, `pnpm-workspace`, `turborepo`, `typescript-strict`
