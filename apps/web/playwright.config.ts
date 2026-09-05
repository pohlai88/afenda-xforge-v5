import { defineConfig, devices } from "@playwright/test";

const port = 3100;
const baseURL = `http://localhost:${port}`;
const isCI = Boolean(process.env.CI);

export default defineConfig({
  expect: { timeout: 10_000 },
  forbidOnly: isCI,
  fullyParallel: true,
  projects: [
    {
      name: "chromium",
      testIgnore: "**/vitals.e2e.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    // Budgets are measured alone, after the suite: worker contention pushed
    // LCP past 2.5 s when the vitals spec shared the server with 11 others.
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
