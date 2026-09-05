import type { OrganizationUnitWithCount } from "@xforge/contracts/unit/types";

export interface UnitTreeNode {
  children: UnitTreeNode[];
  /** Members of this unit AND every descendant — the count a scope shows. */
  subtreeCount: number;
  unit: OrganizationUnitWithCount;
}

const sortByName = (a: UnitTreeNode, b: UnitTreeNode) =>
  a.unit.name.localeCompare(b.unit.name);

/**
 * Flat units → forest, pure and shared by navigator and chart. A unit whose
 * parent is missing from the list is treated as a root rather than dropped —
 * the structure stays visible even if a fixture or adapter has a gap.
 */
export const buildUnitTree = (
  units: readonly OrganizationUnitWithCount[]
): UnitTreeNode[] => {
  const nodes = new Map<string, UnitTreeNode>(
    units.map((unit) => [unit.id, { children: [], subtreeCount: 0, unit }])
  );
  const roots: UnitTreeNode[] = [];
  for (const node of nodes.values()) {
    const parent =
      node.unit.parentId === null ? undefined : nodes.get(node.unit.parentId);
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }
  const total = (node: UnitTreeNode): number => {
    node.children.sort(sortByName);
    node.subtreeCount =
      node.unit.memberCount +
      node.children.reduce((sum, child) => sum + total(child), 0);
    return node.subtreeCount;
  };
  for (const root of roots) {
    total(root);
  }
  roots.sort(sortByName);
  return roots;
};

/** Human wording for a unit type, supplied by data — never hardcoded UI. */
export const unitTypeLabel: Readonly<
  Record<OrganizationUnitWithCount["type"], string>
> = {
  "business-unit": "Business unit",
  department: "Department",
  division: "Division",
  "legal-entity": "Legal entity",
  team: "Team",
};
