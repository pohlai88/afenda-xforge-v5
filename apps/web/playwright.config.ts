import { defineConfig, devices } from "@playwright/test";

const port = 3100;
const baseURL = `http://localhost:${port}`;
const isCI = Boolean(process.env.CI);

// Firefox runs in CI (Ubuntu) and locally on request (E2E_FIREFOX=1). On this
// Windows machine Playwright's Firefox falls back to a software compositor and
// spends 30–40 s per test — the environment, not the app: the tests that
// finish pass, the rest hit the 30 s budget.
const withFirefox = isCI || Boolean(process.env.E2E_FIREFOX);

const screens = [
  {
    name: "chromium",
    testIgnore: "**/vitals.e2e.ts",
    use: { ...devices["Desktop Chrome"] },
  },
  ...(withFirefox
    ? [
        {
          name: "firefox",
          testIgnore: "**/vitals.e2e.ts",
          use: { ...devices["Desktop Firefox"] },
        },
      ]
    : []),
  {
    name: "webkit",
    testIgnore: "**/vitals.e2e.ts",
    use: { ...devices["Desktop Safari"] },
  },
];

export default defineConfig({
  expect: { timeout: 10_000 },
  forbidOnly: isCI,
  fullyParallel: true,
  projects: [
    ...screens,
    // Budgets are measured alone, after the suite: worker contention pushed
    // LCP past 2.5 s when the vitals spec shared the server with 11 others.
    // Chromium only: LCP and INP are Chromium APIs; the other engines report
    // nothing and the spec would pass vacuously.
    {
      dependencies: ["chromium"],
      name: "vitals",
      testMatch: "**/vitals.e2e.ts",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  retries: isCI ? 2 : 0,
  testDir: "./e2e",
  testMatch: "**/*.e2e.ts",
  timeout: 30_000,
  use: {
    actionTimeout: 10_000,
    baseURL,
    navigationTimeout: 15_000,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
  webServer: {
    command: `pnpm build && pnpm start -p ${port}`,
    env: { ...process.env, FIXTURE_FAULTS: "members.list@glitch" },
    reuseExistingServer: !isCI,
    timeout: 180_000,
    url: baseURL,
  },
});
