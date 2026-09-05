import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

const blocking = new Set(["critical", "serious"]);
const MAX_NODES = 6;

/** WCAG 2.2 AA via axe. Serious and critical violations fail the screen (architecture §7.4). */
export const expectNoSeriousViolations = async (page: Page) => {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  const violations = results.violations
    .filter((violation) => blocking.has(violation.impact ?? ""))
    .map((violation) => {
      const nodes = violation.nodes
        .slice(0, MAX_NODES)
        .map(
          (node) => `${node.target.join(" ")} :: ${node.failureSummary ?? ""}`
        )
        .join("\n    ");
      return `${violation.id}: ${violation.help} (${violation.nodes.length} nodes)\n    ${nodes}`;
    });
  expect(violations).toEqual([]);
};
