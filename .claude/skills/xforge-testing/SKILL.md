---
name: xforge-testing
description: Testing in this repository — the two-runner split (Vitest 5 for components, Playwright for the browser), the config surface that actually exists on Vite 8, and the query discipline a component test must follow. Use when writing or reviewing any test under apps/web or packages/design, when adding a test file, when choosing between a component test and an e2e test, when a test needs user interaction, and before trusting recalled Vitest or Testing Library knowledge — the widely-published material targets Vitest 3 and React 18 and is wrong here.
metadata:
  targets: "vitest@5.0.0 vite@8.2.2 @playwright/test@1.62.1 @testing-library/react@16.3.3"
  measured: "2026-09-05"
  method: "versions read from the installed tree; Vitest suite executed green, Playwright executed and its failure root-caused, before writing"
---

# Testing here

Every version below was read from the installed tree on 2026-09-05, not recalled.
`pnpm test` was run green (3 tests, 3 passed). `playwright test` was run twice, failed both
times, and the cause was traced to the environment rather than the app — see rule 7, which
exists because of that run.

    vitest                     5.0.0        vite                  8.2.2
    @vitejs/plugin-react       6.1.1        jsdom                30.0.1
    @playwright/test          1.62.1        react              19.2.8
    @testing-library/react    16.3.3        next               16.3.4
    @testing-library/dom      10.4.1        @testing-library/jest-dom  7.0.1
    @testing-library/user-event 14.6.7

## Why this exists rather than a general testing skill

The public registry's Vitest skills target **Vitest 3**; the React Testing Library ones
target **React 18**. This repo runs Vitest 5 on Vite 8 with React 19. That is not a small
gap — see rule 1, where the config option this repo depends on does not exist before Vite 8.
Recalled testing knowledge is wrong here in the same way Next 14 knowledge is wrong under
`nextjs-16`.

## 1. `resolve.tsconfigPaths` is native. Do not add the plugin.

Both `vitest.config.ts` files carry:

    resolve: { tsconfigPaths: true },

This is a **real Vite 8 option** (present in `vite@8.2.2`'s type definitions) and it is what
makes `import Page from "@/app/page"` resolve under test. It did not exist in Vite 5–7,
where the `vite-tsconfig-paths` plugin was required — which is why most published examples
show `plugins: [react(), tsconfigPaths()]`.

**Do not "fix" this into the plugin form.** `vite-tsconfig-paths` is not installed and not in the pnpm catalog; if it reappears it is a
mistaken re-addition, not a missing wiring.

## 2. Two runners, split by filename, deliberately

    Vitest      tests/**/*.test.{ts,tsx}   and packages/design also src/**/*.test.{ts,tsx}
    Playwright  e2e/**/*.e2e.ts            testDir "./e2e", testMatch "**/*.e2e.ts"

The `.e2e.ts` suffix is not cosmetic. Lint runs on Biome (`biome.jsonc` extends
`ultracite/biome/vitest`), whose test rules key off `*.{test,spec}.*`; under the earlier ESLint
provider a Playwright spec named `*.spec.ts` got Vitest imports auto-inserted on `--fix`.
Keep the suffix.

**Choosing a runner:** a component's rendered output, props, variants and a11y roles are a
Vitest test next to the component. Anything needing a real browser — navigation, a server
response, layout, focus across a page — is Playwright. Do not reach for Playwright to test a
component in isolation; it is ~100× slower and cached by nothing (`test:e2e` is
`cache: false` in `turbo.json`, correctly).

## 3. Query discipline: role first, `getByTestId` last

Testing Library's priority order, applied without exception in review:

    1. getByRole            accessible to everyone, asserts the a11y tree
    2. getByLabelText       form fields
    3. getByPlaceholderText
    4. getByText            non-interactive content
    5. getByDisplayValue
    6. getByAltText / getByTitle
    7. getByTestId          escape hatch — needs a comment justifying it

Both existing tests already do this — `getByRole("button")`, `getByRole("heading", { name })`.
A test that reaches for `container.querySelector` or a test id when a role exists is testing
the DOM rather than the component, and it will not catch the accessibility regression that
is the whole reason `packages/design` exists.

`get*` throws when absent · `query*` returns null (use only to assert absence) ·
`find*` returns a promise (use for anything async). Never `await` a `get*`.

## 4. Interaction uses `user-event`, not `fireEvent`

`@testing-library/user-event@14.6.7` is installed and currently used in **zero** tests. It is
the correct tool the moment a test clicks, types or tabs: `fireEvent` dispatches one synthetic
event, while `user-event` reproduces the full sequence a real user triggers (pointer, focus,
keydown, input, change), which is what catches a control that looks right and behaves wrong.

    const user = userEvent.setup();   // before render
    await user.click(screen.getByRole("button", { name: "Save" }));

`setup()` must be called before `render`, and every method is awaited. Under React 19 with
RTL 16, `act` is handled for you — do not wrap interactions in `act` manually.

## 5. Setup files are one line, and jest-dom v7 keeps the `/vitest` subpath

    import "@testing-library/jest-dom/vitest";

`@testing-library/jest-dom@7.0.1` exports `.`, `./jest-globals`, `./matchers`, `./vitest`.
The `/vitest` subpath survived the v6→v7 major, so this import is correct — verified against
the installed package's `exports` map, not assumed.

## 6. Playwright: web-first assertions, no manual waits

`playwright.config.ts` sets `webServer` on port 3100 (`pnpm dev -p 3100` locally,
`pnpm build && pnpm start -p 3100` in CI), `expect.timeout` 10 s,
`baseURL`, `trace: "on-first-retry"`, `retries: 2` in CI only, and a single chromium project.

Because `expect(locator)` assertions auto-retry until the timeout, a test never needs
`waitForTimeout`, `waitForSelector` or a manual sleep. If a test needs one, the assertion is
wrong.

    await expect(page.getByRole("heading", { name: "Project ready!" })).toBeVisible();

Locators are lazy and re-query on each assertion, so store them freely. `page.goto("/")`
resolves against `baseURL` — never hardcode the host or port.

## 7. `reuseExistingServer` will run your e2e against the wrong app

Measured on 2026-09-05, and the reason this rule is not theoretical.

`playwright.config.ts` sets `reuseExistingServer: !isCI` — true locally. If **anything** is
already listening on the e2e port (3100 since the fix below; 3000 when this was measured),
Playwright does not start `pnpm dev`; it points the whole
suite at whatever is there. On this machine a stale process (PID 33964) was serving a
different build titled "Afenda Xforge — development", so the e2e failed with:

    Error: element(s) not found
    waiting for getByRole('heading', { name: 'Project ready!' })
    5 x waiting for "http://localhost:3000/" navigation to finish...

while the app itself was healthy — served on a free port it returned
`<h1 class="font-medium">Project ready!</h1>` with HTTP 200, and the Vitest test for the same
heading passed.

**Before believing any local e2e failure, check the port:**

    curl -s -o /dev/null -w "%{http_code}
" http://localhost:3100/   # already taken?
    netstat -ano | grep ":3100 "                                       # by whom?

An `element(s) not found` on a component you can see rendering is this, not a broken app.
The fix that followed: e2e now runs on its own port, 3100, so a dev server on 3000 (usually a
different project) is never tested by mistake. CI
is unaffected (`isCI` makes it false, and the server is built fresh).

## 8. Where the numbers stand, and what the harness does not yet do

Measured 2026-09-05 after the members slice: **59 Vitest tests** (contracts 12, design 6, web 41)
and **9 Playwright tests**, all green; `pnpm check` covers 106 files in ~0.2 s.

- **Cleanup is explicit.** Vitest exposes no globals, so Testing Library cannot register its own
  `afterEach(cleanup)`; both `tests/setup.ts` files do it. Without it a second `render` in the
  same file finds the first one's DOM.
- **Mock at the boundary, with `vi.hoisted`.** Component tests mock `@/features/<domain>/actions`
  (server actions import `@/lib/data`, and `server-only` throws under jsdom by design); action
  tests mock `@/lib/data` to return a fresh `createFixtureDomainSources()` per test. Declare mock
  functions inside `vi.hoisted(() => ({...}))` — a plain `const` is in its temporal dead zone when
  the hoisted factory runs.
- **Fixture workspaces have roles.** acme is counted by the read e2e and must not change; orbit is
  the one the mutation e2e may change (use a unique email per run — the dev server keeps
  mutations until it restarts); northwind holds the single-owner invariant; glitch is faulted by
  `FIXTURE_FAULTS=members.list@glitch` on Playwright's web server for the error state.
- **Axe runs on every screen state** via `e2e/axe.ts` — serious and critical block; its first
  catch was a real one (muted text on `bg-muted` at 4.34:1, fixed in the token).
- **Timeouts are looser locally on purpose.** `navigationTimeout`/`actionTimeout` are 60 s/30 s
  outside CI because `next dev` cold-compiles the members route under six parallel first visits;
  CI runs a prebuilt server with the tight values.
- **No coverage.** `turbo.json`'s `test` task declares neither `inputs` nor `outputs`. Adding
  `--coverage` without adding `"outputs": ["coverage/**"]` gives you a cached task that
  produces no restorable artefact.
- **One browser.** `projects` is chromium only. Cross-browser claims are unfounded here.
