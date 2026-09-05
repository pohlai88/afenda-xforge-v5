import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

/**
 * Core Web Vitals budgets against the production build the e2e run serves
 * (architecture §7.4). LCP/CLS/INP thresholds are the "good" boundaries; the
 * JavaScript budget is the measured baseline plus headroom, so a dependency
 * that lands on the client by accident fails here before it ships.
 */
const VITALS = { CLS: 0.1, INP: 200, LCP: 2500 } as const;

// Baseline 2026-09-05 (production build, gzip): "/" 142 KB in 7 scripts,
// "/acme/members" 322 KB in 11 scripts. Budgets are that plus ~25 % headroom.
const ROUTES = [
  { heading: "Afenda xForge", jsKb: 180, path: "/" },
  { heading: "Members", jsKb: 400, path: "/acme/members" },
] as const;

type Vitals = Partial<Record<"CLS" | "INP" | "LCP", number>>;
type Report = (metric: { name: string; value: number }) => void;
type Register = (report: Report, options: { reportAllChanges: true }) => void;
interface Instrumented {
  __vitals: Vitals;
  webVitals: { onCLS: Register; onINP: Register; onLCP: Register };
}

// web-vitals 6 does not export its IIFE build through `exports`, and Playwright
// evaluates init scripts in their own scope, so the global is exposed by hand.
const webVitalsSource = `${readFileSync(
  new URL(
    "../node_modules/web-vitals/dist/web-vitals.iife.js",
    import.meta.url
  ),
  "utf8"
)}
window.webVitals = webVitals;`;

// One at a time, on a server that has already rendered the route once. The
// warm-up goes through the API context so the browser cache stays cold and
// the transfer sizes below are what a first visit pays.
test.describe.configure({ mode: "serial" });

for (const route of ROUTES) {
  test(`${route.path} stays within the Core Web Vitals budget`, async ({
    page,
  }) => {
    await page.addInitScript(webVitalsSource);
    await page.addInitScript(() => {
      const w = window as unknown as Instrumented;
      w.__vitals = {};
      const record: Report = (metric) => {
        w.__vitals[metric.name as keyof Vitals] = metric.value;
      };
      w.webVitals.onLCP(record, { reportAllChanges: true });
      w.webVitals.onCLS(record, { reportAllChanges: true });
      w.webVitals.onINP(record, { reportAllChanges: true });
    });

    await page.request.get(route.path);
    await page.goto(route.path);
    await expect(
      page.getByRole("heading", { name: route.heading })
    ).toBeVisible();
    // An interaction finalises LCP and gives INP something to measure.
    await page.keyboard.press("Tab");
    await expect
      .poll(() =>
        page.evaluate(() => (window as unknown as Instrumented).__vitals.LCP)
      )
      .toBeGreaterThan(0);

    const vitals = await page.evaluate(
      () => (window as unknown as Instrumented).__vitals
    );
    const weight = await page.evaluate(() => {
      const scripts = performance
        .getEntriesByType("resource")
        .filter(
          (entry): entry is PerformanceResourceTiming =>
            entry instanceof PerformanceResourceTiming &&
            new URL(entry.name).pathname.endsWith(".js")
        );
      const bytes = scripts.reduce((sum, entry) => sum + entry.transferSize, 0);
      return { scripts: scripts.length, transferKb: Math.round(bytes / 1024) };
    });
    test.info().annotations.push({
      description: JSON.stringify({ ...vitals, ...weight }),
      type: "vitals",
    });

    expect.soft(vitals.LCP, "LCP (ms)").toBeLessThanOrEqual(VITALS.LCP);
    expect.soft(vitals.CLS ?? 0, "CLS").toBeLessThanOrEqual(VITALS.CLS);
    expect.soft(vitals.INP ?? 0, "INP (ms)").toBeLessThanOrEqual(VITALS.INP);
    expect
      .soft(weight.transferKb, "JavaScript transferred (KB)")
      .toBeLessThanOrEqual(route.jsKb);
  });
}
