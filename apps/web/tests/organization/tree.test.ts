import { acmeUnits } from "@xforge/contracts/fixtures/units";
import type { OrganizationUnitWithCount } from "@xforge/contracts/unit/types";
import { describe, expect, it } from "vitest";
import { buildUnitTree } from "@/features/organization/tree";

// The acme tree: Acme Group → (Finance, Operations → Support).
const counts: Record<string, number> = {
  "Acme Group": 1,
  Finance: 2,
  Operations: 2,
  Support: 2,
};

const withCounts: OrganizationUnitWithCount[] = acmeUnits.map((unit) => ({
  ...unit,
  memberCount: counts[unit.name] ?? 0,
}));

describe("buildUnitTree", () => {
  it("builds the forest and aggregates subtree counts", () => {
    const roots = buildUnitTree(withCounts);
    expect(roots).toHaveLength(1);
    const [group] = roots;
    expect(group?.unit.name).toBe("Acme Group");
    expect(group?.subtreeCount).toBe(7);
    expect(group?.children.map((child) => child.unit.name)).toEqual([
      "Finance",
      "Operations",
    ]);
    const operations = group?.children.find(
      (child) => child.unit.name === "Operations"
    );
    expect(operations?.subtreeCount).toBe(4);
    expect(operations?.children[0]?.unit.name).toBe("Support");
  });

  it("treats a unit with a missing parent as a root, never drops it", () => {
    const orphaned = withCounts.filter((unit) => unit.name !== "Operations");
    const roots = buildUnitTree(orphaned);
    expect(roots.map((root) => root.unit.name).sort()).toEqual([
      "Acme Group",
      "Support",
    ]);
  });

  it("is empty for no units", () => {
    expect(buildUnitTree([])).toEqual([]);
  });
});
