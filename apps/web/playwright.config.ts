import { defineConfig, devices } from "@playwright/test";

// A dedicated port: with reuseExistingServer on, anything already listening
// on the default 3000 (another Next app, a stale dev server) would be tested
// instead of this one.
const port = 3100;
const baseURL = `http://localhost:${port}`;
const isCI = Boolean(process.env.CI);

export default defineConfig({
  // next dev compiles routes on first request; give assertions headroom.
  expect: { timeout: 10_000 },
  forbidOnly: isCI,
  fullyParallel: true,
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  retries: isCI ? 2 : 0,
  testDir: "./e2e",
  // *.e2e.ts keeps Playwright specs out of the *.test.* / *.spec.* globs the
  // Vitest tooling treats as unit tests.
  testMatch: "**/*.e2e.ts",
  timeout: 30_000,
  use: {
    actionTimeout: isCI ? 10_000 : 30_000,
    baseURL,
    // next dev compiles a route on first visit; six parallel first visits
    // to a heavy route exceed 15 s locally. CI runs a prebuilt server.
    navigationTimeout: isCI ? 15_000 : 60_000,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
  webServer: {
    command: isCI
      ? `pnpm build && pnpm start -p ${port}`
      : `pnpm dev -p ${port}`,
    // The glitch members list is faulted so the error state has an e2e.
    env: { ...process.env, FIXTURE_FAULTS: "members.list@glitch" },
    reuseExistingServer: !isCI,
    timeout: 120_000,
    url: baseURL,
  },
});
