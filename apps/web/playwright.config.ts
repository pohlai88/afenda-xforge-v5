import { defineConfig, devices } from "@playwright/test";

// A dedicated port: with reuseExistingServer on, anything already listening
// on the default 3000 (another Next app, a stale dev server) would be tested
// instead of this one.
const port = 3100;
const baseURL = `http://localhost:${port}`;
const isCI = Boolean(process.env.CI);

export default defineConfig({
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
    actionTimeout: 10_000,
    baseURL,
    navigationTimeout: 15_000,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
  webServer: {
    // Always a production build: Next 16 allows one `next dev` per project,
    // so an e2e dev server would collide with the one you are working in —
    // and testing the built app is what CI does anyway.
    command: `pnpm build && pnpm start -p ${port}`,
    // The glitch members list is faulted so the error state has an e2e.
    env: { ...process.env, FIXTURE_FAULTS: "members.list@glitch" },
    reuseExistingServer: !isCI,
    timeout: 180_000,
    url: baseURL,
  },
});
