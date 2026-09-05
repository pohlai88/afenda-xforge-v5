# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Afenda xForge v5 — a SaaS being built **frontend-first**. pnpm workspaces + Turborepo; Next.js 16 App Router; shadcn/ui on the Radix base; Ultracite on the Biome backend for lint/format. No database, server or auth exists yet — that is sequencing, not the product's shape. The planned data layer is Drizzle + Neon Postgres with Better Auth; adding it is a deliberate decision that updates this file before it changes code. Until then, screens are built against local/mocked data at the UI edge — do not add Route Handlers, Server Actions or server-side `fetch` to satisfy a screen.

Also read `AGENTS.md` (Next.js 16 is not the Next.js in training data — consult `node_modules/next/dist/docs/`; Ultracite code standards) and load the `nextjs-16` skill before touching `apps/web`. `next dev` regenerates `apps/web/AGENTS.md` and `apps/web/CLAUDE.md` on every run; commit them rather than fighting them.

## Commands

All from the repo root. pnpm 11, Node ≥ 22. `.npmrc` sets `save-exact`, so `pnpm add` pins exact versions.

| Task | Command |
| --- | --- |
| Install | `pnpm install` |
| Dev server | `pnpm dev` — one app: `pnpm --filter @xforge/web dev` (port 3000; pass `-p <port>` if 3000 is taken by another Next app — it often is) |
| Build | `pnpm build` |
| Typecheck | `pnpm typecheck` |
| Lint + format check, whole repo | `pnpm check` (`pnpm lint` is an alias; ~1 s) |
| Auto-fix lint + format | `pnpm fix` — one file: `pnpm exec ultracite fix <path>` |
| Unit tests, all packages | `pnpm test` |
| Unit tests, one package | `pnpm --filter @xforge/design test` |
| One test file | `pnpm --filter @xforge/web exec vitest run tests/home.test.tsx` |
| One test by name | `pnpm --filter @xforge/design exec vitest run -t "renders an accessible button"` |
| Watch mode | `pnpm --filter @xforge/web test:watch` |
| E2E (Playwright; starts `next dev -p 3100` itself) | `pnpm --filter @xforge/web test:e2e` — first time: `pnpm --filter @xforge/web exec playwright install chromium` |
| Add a shadcn component | `pnpm dlx shadcn@4.21.0 add <name> -c apps/web` → lands in `packages/design/src/components/` |

The `.claude/settings.json` PostToolUse hook runs the single-file fix after every Write/Edit; still run `pnpm check` before calling a change done.

**Version pins live in one place:** `pnpm-workspace.yaml` `catalog:` (workspaces reference entries as `"catalog:"`). Bump there, then `pnpm install`. Two pins are deliberate ceilings: TypeScript 5.9.3 (Next's tooling and Biome's type inference are validated against 5.x; TS 7 is a separate decision), and `radix-ui` 1.6.7 rather than Base UI (still `1.0.0-rc`) — see _Planned direction_. pnpm blocks install scripts by default; `allowBuilds` in the workspace file is the allowlist. pnpm's `minimumReleaseAge` policy is on; it appends `minimumReleaseAgeExclude` entries itself when a pinned version is younger than the cutoff.

## Layout

```
apps/web                    @xforge/web     Next.js 16 app (Turbopack). app/, components/, tests/ (Vitest), e2e/ (Playwright)
packages/design             @xforge/design  shadcn/ui components + globals.css (Tailwind v4 theme). No build step: consumed as source via transpilePackages
packages/typescript-config                  shared tsconfig bases: base.json, nextjs.json, react-library.json
```

- Import design code as `@xforge/design/components/<name>`, `@xforge/design/lib/utils` (`cn`), `@xforge/design/hooks/<name>`, and the stylesheet as `@xforge/design/globals.css`. These resolve through `packages/design/package.json` `exports` **and** the `paths` in both tsconfigs — keep all three in sync when adding an export.
- `apps/web/components.json` + `packages/design/components.json` are the shadcn config (style `radix-nova`, aliases above). Always run the CLI with `-c apps/web`; it writes into `packages/design` through the aliases.
- Both packages resolve modules with `moduleResolution: Bundler` (no file extensions on relative imports). `verbatimModuleSyntax` is on, so type-only imports must be `import type` — Biome's `useImportType` rewrites them on `pnpm fix`. The shared bases live in `packages/typescript-config`; add compiler flags there, not per package.
- Tailwind is compiled once, in `apps/web` (`postcss.config.mjs`), from `packages/design/src/styles/globals.css`; that file's `@source` globs add `apps/**` and the design package to content scanning. Tailwind only inlines **string** `@import`s (`@import "tailwindcss"`); `@import url(...)` is left for Turbopack, which cannot resolve it under pnpm's isolated `node_modules`. Biome's CSS formatter leaves the notation alone (Stylelint did not — that is why it is gone).
- Theme: `next-themes` with `attribute="class"`; `apps/web/components/theme-provider.tsx` also binds the `d` hotkey. Colours are oklch CSS variables in `globals.css`, exposed to Tailwind via `@theme inline`.

## Lint/format: Ultracite on Biome

`biome.jsonc` extends `ultracite/biome/{core,next,react,vitest}` and adds two things, both commented in the file:

- `files.includes` excludes `.agents/`, `.claude/` and `skills-lock.json` — vendored skills and reference docs; reformatting them breaks `skills-lock.json` hashes. Ultracite's own ignores use `!!` globs and survive that list.
- `overrides` for shadcn-generated code only: `packages/design/src/components/**` may keep `import * as React` and unsorted cva variant maps (`noNamespaceImport`, `useSortedKeys` off); `packages/design/src/lib/**` may re-export `cn` (`noBarrelFile` off).

Everywhere else Ultracite's standards apply and `pnpm fix` enforces most of them: sorted object keys, JSX attributes and `package.json` fields; `import type`; organised imports; Tailwind class order via `useSortedClasses` (knows `cn`/`cva`); no namespace imports. Tailwind's `@theme`/`@apply`/`@custom-variant` parse natively (`css.parser.tailwindDirectives`). Biome does not lint Markdown or YAML.

Test-file suffixes route to the two runners: `*.test.{ts,tsx}` = Vitest (Biome's test rules — no focused/skipped tests, no exports — key off `*.test.*` / `*.spec.*` names), `*.e2e.ts` = Playwright.

History, so nobody repeats it: the scaffold started on Ultracite's ESLint provider and was switched the same day — 60 s checks, 36 lint dev-dependencies, and seven provider defects (TS parser only on `*.ts`, hardcoded root tsconfig, JSON parsed as JS, `@import` rewritten to `url()`, vitest imports injected into Playwright specs, two self-conflicting rules). Biome checks the repo in under a second with two dev-dependencies.

## Tests

Vitest 5 + Testing Library + jsdom in both packages (`vitest.config.ts`; `tests/setup.ts` loads jest-dom matchers). Vite's native `resolve.tsconfigPaths` resolves the `@xforge/design/*` and `@/*` aliases — no plugin. Turbo runs `test` per package after its dependencies' tests. Playwright uses port 3100 with `reuseExistingServer` on locally, so a dev server already on 3000 (usually a different project) is never tested by mistake; `expect` timeout is 10 s to absorb `next dev`'s first compile. A failure keeps its trace, screenshot and video under `apps/web/test-results/` (gitignored); CI adds an HTML report.

## Agent config in `.claude/`

Carried over from v4 and trimmed to what still applies: `launch.json` (preview: `pnpm --filter @xforge/web dev`), `settings.json` (thinking/effort settings, a permission allowlist for the verification commands above, and the per-file format hook `.claude/hooks/format.mjs`; personal overrides go in the gitignored `settings.local.json`), skills `nextjs-16` (rewritten for v5), `ultracite`, `vercel-react-best-practices`, `pnpm-workspace`, `turborepo`, and `llmx/` — LLM-readable docs for Base UI, Material 3, Prototyper UI and Fragments, kept as design reference. `.agents/skills/` and `skills-lock.json` are managed by the `skills` CLI; do not edit by hand.

## Planned direction (not yet in code)

- **Design primitives: Radix → Base UI.** shadcn's CLI supports `--base base`; the Base UI docs are already in `.claude/llmx/base-ui/`. Until the switch is made, do not mix `@base-ui/react` into `packages/design`.
- **Backend:** Drizzle + Neon Postgres, Better Auth. Nothing in the repo assumes it yet.
