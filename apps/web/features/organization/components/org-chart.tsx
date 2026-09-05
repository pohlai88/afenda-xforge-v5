import type { MemberFilter } from "@xforge/contracts/member/types";
import type { OrganizationUnitWithCount } from "@xforge/contracts/unit/types";
import Link from "next/link";
import { workspacePath, workspaceQueryString } from "../filter";
import { buildUnitTree, type UnitTreeNode, unitTypeLabel } from "../tree";

interface ChartProps {
  filter: MemberFilter;
  orgSlug: string;
  units: readonly OrganizationUnitWithCount[];
}

const scopeHref = (props: ChartProps, unitId: string) =>
  `${workspacePath(props.orgSlug)}${workspaceQueryString({
    filter: {
      ...props.filter,
      page: 1,
      unitId: unitId as MemberFilter["unitId"],
    },
    view: "people",
  })}`;

/**
 * The structural view of the same workspace context — quiet cards, no
 * gradients, no oversized anything. Clicking a unit scopes the People view
 * to it; drag/drop reorganization is deliberately absent from V1.
 */
const ChartNode = ({
  node,
  props,
}: Readonly<{ node: UnitTreeNode; props: ChartProps }>) => (
  <li>
    <Link
      className="inline-flex flex-col rounded-lg border border-border bg-card px-4 py-3 hover:bg-accent"
      href={scopeHref(props, node.unit.id)}
    >
      <span className="font-medium text-sm">{node.unit.name}</span>
      <span className="mt-0.5 text-muted-foreground text-xs">
        {unitTypeLabel[node.unit.type]} ·{" "}
        <span className="tabular-nums">{node.subtreeCount}</span>{" "}
        {node.subtreeCount === 1 ? "person" : "people"}
      </span>
    </Link>
    {node.children.length > 0 ? (
      <ul className="mt-3 ml-4 flex flex-col gap-3 border-border border-l pl-6">
        {node.children.map((child) => (
          <ChartNode key={child.unit.id} node={child} props={props} />
        ))}
      </ul>
    ) : null}
  </li>
);

export const OrgChart = (props: ChartProps) => {
  const roots = buildUnitTree(props.units);
  if (roots.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No organization structure yet.
      </p>
    );
  }
  return (
    <ul className="flex flex-col gap-3">
      {roots.map((root) => (
        <ChartNode key={root.unit.id} node={root} props={props} />
      ))}
    </ul>
  );
};
