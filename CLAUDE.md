# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Afenda xForge v5 — a SaaS being built **frontend-first**. pnpm workspaces + Turborepo; Next.js 16 App Router; shadcn/ui on the Base UI base; Ultracite on the Biome backend for lint/format. No database, server endpoints or auth exist yet — that is sequencing, not the product's shape. The planned data layer is Drizzle + Neon Postgres with Better Auth; adding it is a deliberate decision that updates this file before it changes code. Until then, screens read and mutate through the **contract seam**: `@xforge/contracts` defines the domain, `apps/web/lib/data` serves it from an in-memory fixture adapter, and server actions mutate through the same interface.

Also read `AGENTS.md` (Next.js 16 is not the Next.js in training data — consult `node_modules/next/dist/docs/`; Ultracite code standards) and load the `nextjs-16` skill before touching `apps/web`, `xforge-testing` before writing a test. The architecture — boundaries, the contract/data seam, design-system layers, the ADR register — is `docs/architecture.md`; read it before adding a package, a route group or a data source. `next dev` regenerates `apps/web/AGENTS.md` and `apps/web/CLAUDE.md` on every run; commit them rather than fighting them.

## Commands

All from the repo root. pnpm 11, Node ≥ 22. `pnpm-workspace.yaml` sets `saveExact` (so `pnpm add` pins exact versions) and `engineStrict` (so an install on Node < 22 or pnpm < 11 fails rather than warns). pnpm 11 ignores both in `.npmrc` — that file is gone; do not reintroduce it.

| Task | Command |
| --- | --- |
| Install | `pnpm install` |
| Dev server | `pnpm dev` — one app: `pnpm --filter @xforge/web dev` (port 3000; pass `-p <port>` if 3000 is taken by another Next app — it often is) |
| Build | `pnpm build` |
| Typecheck | `pnpm typecheck` |
| Lint + format check, whole repo | `pnpm check` (`pnpm lint` is an alias; ~0.2 s) |
| Auto-fix lint + format | `pnpm fix` — one file: `pnpm exec ultracite fix <path>` |
| Unit tests, all packages | `pnpm test` (103: contracts 12, design 39, web 52) |
| Unit tests, one package | `pnpm --filter @xforge/contracts test` |
| One test file | `pnpm --filter @xforge/web exec vitest run tests/members/actions.test.ts` |
| One test by name | `pnpm --filter @xforge/contracts exec vitest run -t "last active owner"` |
| Watch mode | `pnpm --filter @xforge/web test:watch` |
| Coverage | `pnpm test:coverage` — `@vitest/coverage-v8`, text + lcov into each package's `coverage/`; its own Turbo task with `"outputs": ["coverage/**"]`, so a cache hit restores the report |
| E2E (Playwright + axe; builds and starts the app on :3100 itself) | `pnpm --filter @xforge/web test:e2e` — first time: `pnpm --filter @xforge/web exec playwright install chromium firefox webkit`. Always a production build: Next 16 allows one `next dev` per project, so it never collides with your dev server. 13 tests in Chromium and WebKit, plus Firefox in CI or with `E2E_FIREFOX=1` (Playwright's Firefox runs on a software compositor on this Windows box and takes 30–40 s a test); the vitals spec is Chromium-only because LCP and INP are Chromium APIs. `e2e/vitals.e2e.ts` carries the Core Web Vitals and per-route JavaScript budgets |
| See the error state in dev | `FIXTURE_FAULTS=members.list@glitch pnpm --filter @xforge/web dev -p 3200` → `/glitch/members` |
| Bundle analyzer | `pnpm analyze` — Turbopack's `next experimental-analyze`: an interactive treemap with import chains, no app build. `@next/bundle-analyzer` is the Webpack plugin and is not installed |
| Add a shadcn component | `pnpm dlx shadcn@4.21.0 add <name> -c apps/web --overwrite` → lands in `packages/design/src/components/`; check `git diff -- '*/package.json'` afterwards — the CLI writes new deps into `apps/web`, and a dep the *component* imports belongs in `packages/design` (see `sonner`) |

The `.claude/settings.json` PostToolUse hook runs the single-file fix after every Write/Edit; still run `pnpm check` before calling a change done. CI (`.github/workflows/ci.yml`) runs check, typecheck, test, build and the e2e against a production build.

**Version pins live in one place:** `pnpm-workspace.yaml` `catalog:` (workspaces reference entries as `"catalog:"`). Bump there, then `pnpm install`. Two pins are deliberate ceilings: TypeScript 5.9.3 (Next's tooling and Biome's type inference are validated against 5.x; TS 7 is a separate decision), and `@base-ui/react` 1.8.0 (shadcn's default base since July 2026; the scaffold started on Radix and was migrated per component the same day — reports in `.migration/`). pnpm blocks install scripts by default; `allowBuilds` in the workspace file is the allowlist. pnpm's `minimumReleaseAge` policy is on; it appends `minimumReleaseAgeExclude` entries itself when a pinned version is younger than the cutoff.

## Layout

```
apps/web                    @xforge/web        Next.js 16 app (Turbopack)
  app/(marketing)             landing
  app/(auth)/sign-in          stub until Better Auth
  app/(app)/[orgSlug]         tenant from the URL; layout resolves it through the contract or notFound()
    members/                  page (read), loading.tsx, error.tsx; (app)/not-found.tsx says "Workspace unavailable"
  features/<domain>/          filter.ts (URL → filter), queries.ts, actions.ts ('use server'), components/
  components/app-shell/       sidebar-nav is the client leaf; one DOM, top bar under md, sidebar above
  components/theme-toggle.tsx visible twin of the d hotkey (client leaf)
  lib/data/                   getDomainSources() — the ONLY module that knows adapters exist; adapters/fixtures/{store,source,faults}
  lib/actions/result.ts       ActionResult — what a server action returns
  tests/ · e2e/               Vitest (*.test.tsx) · Playwright (*.e2e.ts, axe.ts helper)
packages/contracts          @xforge/contracts  zod-only: ids (branded), errors, <domain>/{schema,types,source,contract}, fixtures/
packages/design             @xforge/design     src/foundation/ (the ADL as data) + src/styles/ (its Level-2 CSS, entry index.css) + src/blocks/ (governed components, one folder each — the CLI never writes here) + src/components/ (shadcn-vendored, the CLI's write target); tests/ hold the composite behaviour contracts and R11–R14
packages/typescript-config                     base.json → library.json (Bundler) → react-library.json (jsx); nextjs.json
```

- Import governed components as `@xforge/design/blocks/<name>` (ADR-016; vendored shadcn files as `@xforge/design/components/<name>` until their block exists), `@xforge/design/lib/utils` (`cn`), and the canonical stylesheet as `@xforge/design/styles/index.css` (only `apps/web/app/globals.css` imports it); contracts as `@xforge/contracts/<domain>/<file>`, `@xforge/contracts/ids`, `/errors`, `/sources`, `/fixtures/<file>`. These resolve through each package's `exports` **and** the `paths` in `apps/web/tsconfig.json` — keep both in sync when adding an export.
- `apps/web/components.json` + `packages/design/components.json` are the shadcn config (style `base-nova`, base `base`). Base UI, not Radix: polymorphism is the `render` prop (`<Button render={<Link href="/" />}>Home</Button>`), never `asChild`; menu items take `onClick`; a `DropdownMenuLabel` must sit inside a `DropdownMenuGroup` or the popup throws; `Select.onValueChange` receives `string | null` and `SelectValue` needs `items` on the root to label the value on the server. Always run the CLI with `-c apps/web`; it writes into `packages/design` through the aliases.
- Every package resolves modules with `moduleResolution: Bundler`; `verbatimModuleSyntax` is on, so type-only imports must be `import type` — Biome's `useImportType` rewrites them on `pnpm fix`. Compiler flags go in `packages/typescript-config`, not per package.
- Tailwind is compiled once, in `apps/web` (`postcss.config.mjs`), from `apps/web/app/globals.css` — which imports the canonical `@xforge/design/styles/index.css` (the ADL graph, R11/R12), wires next/font into the ADL reference tier, `@source`s the design package, and carries the **transitional shadcn colour bridge**: legacy colour vocabulary (`bg-background`, `text-muted-foreground`, …) aliased onto ADL system roles, deleted line by line as `10-components/*` rewrites each component as a block. The ADL wipes only Tailwind's **colour** namespace (`--color-*: initial`, in its own `@theme` block — the formatter sorts declarations, and a shared block wipes its own definitions); structural defaults (spacing, type scale, weights, breakpoints) stay alive. Tailwind only inlines **string** `@import`s; `@import url(...)` is left for Turbopack, which cannot resolve it under pnpm's isolated `node_modules`. Biome's CSS formatter leaves the notation alone.
- Theme: `next-themes` with `attribute="data-theme"`; `apps/web/components/theme-provider.tsx` also binds the `d` hotkey; `components/theme-toggle.tsx` is its visible twin in the shell. Colours are the ADL (ADR-014): reference oklch values live in `packages/design/src/styles/tokens.css`, semantic roles resolve in `color.css` per context (`data-theme`, `data-contrast`, `data-density`, `data-script`, `dir`), and every value changes with its measurement in the comment beside it, never at a call site. `packages/design/tests/schemes.test.ts` (R13) measures every derived pair across all six schemes — 4.5:1 text, 3:1 boundaries, hover composites, data floors, Oklab ladder separation (one ratcheted waiver), sRGB gamut; `language.test.ts` (R11/R12/R14) holds Level 2 equal to the Level-1 data and the graph wired; R5 (bridge alias cycles) and R10 (the reduced-motion collapse) moved with the bridge into `apps/web/tests/design-vocabulary.test.ts`.

## Rules the code is built to

1. **Contract-first is not future-first.** The seam (`@xforge/contracts`) exists before implementation, but only for capabilities a screen observes: `OrganizationSource.getBySlug`, `MemberSource.{list,invite,updateRole,remove}`. Add `members.get` or `organizations.create` when a screen needs them, with contract tests in the same commit.
2. **Tenant scope is part of the operation, not an optional filter.** Every member operation takes `organizationId`; the server resolves it from the URL slug (`[orgSlug]/layout.tsx`, `features/*/actions.ts`); the client never supplies an organization id. A member outside the organization is `NotFound`, never "found elsewhere".
3. **Five states, five mechanisms.** loading → `loading.tsx`; empty → domain UI; populated → domain UI; resource absent → `notFound()` / `not-found.tsx`; system failure → `throw` → `error.tsx`. Expected mutation outcomes are `ActionResult` values (`VALIDATION` with field errors, `CONFLICT`, `INVARIANT`, `NOT_FOUND`) — never throws.
4. **`features/**`, `app/**` and `components/**` import data only through `@/lib/data`** — never `adapters/*`, never `@xforge/contracts/fixtures/*` (Biome enforces both).
5. **Fixtures describe valid domain state only.** acme (populated, two owners), blank-co (empty), northwind (one owner — the invariant), orbit (the workspace mutation e2e may change), glitch (ordinary; the e2e harness faults its list). Failure is injected by the adapter (`FIXTURE_FAULTS=op@slug`), never modelled as a fixture. `createFixtureDomainSources()` is always a fresh instance (tests); `getFixtureDomainSources()` is the dev-only singleton.
6. **Invariants live in the contract suite** (`packages/contracts/src/<domain>/contract.ts`) and every adapter must pass it: tenant isolation, email unique per organization, ≥ 1 active owner, pagination bounds. The fixture adapter passes it today (`apps/web/lib/data/adapters/fixtures/source.test.ts`); the database adapter must later.
7. **A screen writes vocabulary, not values.** `apps/web/{app,components,features}` may not carry a Tailwind palette colour, a colour literal, an arbitrary `[…]` value or a raw `z-`/`duration-`/`opacity-` step — `apps/web/tests/design-vocabulary.test.ts` (R3) refuses them; a named utility (`z-overlay`, `duration-fast`) is minted in `globals.css` when the first screen needs it. Every token the `@theme` bridge projects has a statically discoverable consumer or a declared reason (R4, same file). A component's parts are its `data-slot` names, each classified in `packages/design/src/anatomy.ts` (ten closed classes; a divider never draws `--input`, `--primary` or `--ring`) and pinned in `packages/design/tests/anatomy.test.ts` (R2). Each of these checks carries a planted defect beside it; a rule that cannot be shown failing ships as labelled prose.

## Lint/format: Ultracite on Biome

`biome.jsonc` extends `ultracite/biome/{core,next,react,vitest}` and adds, all commented in the file: `files.experimentalScannerIgnores: ["node_modules"]` (deprecated key, kept on purpose — without it Biome's type inference indexed zod's typings and checks took ~20 s; the suggested `!!**/node_modules` include does not have the same effect), excludes for `.agents/`, `.claude/`, `skills-lock.json`, and three overrides: `packages/contracts/**` may not import React/Next/app code; `apps/web/{app,components,features}/**` may not import adapters or fixtures; `packages/design/src/components/**` keeps shadcn's upstream style (namespace React import, unsorted cva maps, a few suspicious/a11y rules off) so `shadcn diff` stays meaningful.

Everywhere else Ultracite's standards apply and `pnpm fix` enforces most of them: sorted object keys, JSX attributes and `package.json` fields; `import type`; organised imports; Tailwind class order via `useSortedClasses`; no namespace imports; no arrow functions in JSX props (extract a handler, or a tiny child component when the handler needs an argument); `interface` + property signatures for object types; no `await` in loops; top-level regex literals. Biome does not lint Markdown or YAML.

## Tests

Doctrine is in `.claude/skills/xforge-testing` — read it before writing one. In short: `*.test.tsx` is Vitest 5 + Testing Library + jsdom (roles first, `user-event`, `afterEach(cleanup)` registered in `tests/setup.ts` because Vitest exposes no globals); `*.e2e.ts` is Playwright against a production build on port 3100 with `expectNoSeriousViolations(page)` from `e2e/axe.ts` on every screen state. Mock at the boundary: component tests mock `@/features/<domain>/actions`, action tests mock `@/lib/data` with a fresh `createFixtureDomainSources()` — importing `@/lib/data` itself in jsdom throws, by design (`server-only`). Composite behaviour contracts (Dialog focus return, DropdownMenu keyboard, Field error association) live in `packages/design/tests/`. `e2e/vitals.e2e.ts` injects `web-vitals` before navigation and asserts LCP/CLS/INP plus the JavaScript transferred per route against budgets in the file; raise a budget only with the number that justifies it. The design checks (R2–R5, R10–R15: `packages/design/tests/{anatomy,language,schemes,blocks}.test.ts`, `apps/web/tests/design-vocabulary.test.ts`) read source and CSS as text and each proves itself on a planted defect in the same file; R11/R12 hold the Level-2 styles equal to the Level-1 foundation data (ADR-014/015), R13 measures every derived pair across the six ADL schemes with one ratcheted waiver, R14 holds the registry, identity blocks and `AF-*` rule-ID grammar to themselves — `10-components/*` included when it lands — and R5/R10 guard the app's bridge and reduced-motion collapse. R1/R8/R9 retired 2026-09-05 with the legacy stylesheet; R13 is their ADL successor.

## Agent config in `.claude/`

`launch.json` (preview: `pnpm --filter @xforge/web dev`), `settings.json` (thinking/effort settings, a permission allowlist for the verification commands above and `git push`, and the per-file format hook `.claude/hooks/format.mjs`; personal overrides go in the gitignored `settings.local.json`), skills `nextjs-16`, `xforge-testing`, `ultracite`, `vercel-react-best-practices`, `pnpm-workspace`, `turborepo`, and `llmx/` — LLM-readable docs for Base UI, Material 3, Prototyper UI and Fragments, kept as design reference. `.agents/skills/` and `skills-lock.json` are managed by the `skills` CLI; do not edit by hand.

## Planned direction (not yet in code)

- **Backend:** Better Auth (organisations) + Drizzle + Neon behind the same contract — `docs/architecture.md` §5.5 is the playbook. `DATA_SOURCE=db` already exists as a switch that throws "not implemented".
- **Client server-state:** TanStack Query when the first live/optimistic screen appears; not before.
- **Design-system generator / manifest:** rejected for the current scale, not permanently (ADR-010) — reconsider only on measured, recurring drift that R1–R4 cannot catch economically. **DTCG export:** deferred until a machine-readable consumer outside the CSS build exists.
