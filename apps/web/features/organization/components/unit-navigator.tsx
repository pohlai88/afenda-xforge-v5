"use client";

import type { MemberFilter } from "@xforge/contracts/member/types";
import type { OrganizationUnitWithCount } from "@xforge/contracts/unit/types";
import { Button } from "@xforge/design/blocks/button";
import { cn } from "@xforge/design/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  type WorkspaceView,
  workspacePath,
  workspaceQueryString,
} from "../filter";
import { buildUnitTree, type UnitTreeNode } from "../tree";

interface NavigatorProps {
  activeUnitId: string | undefined;
  filter: MemberFilter;
  onNavigate?: () => void;
  orgSlug: string;
  units: readonly OrganizationUnitWithCount[];
  view: WorkspaceView;
}

interface NodeProps extends Omit<NavigatorProps, "units"> {
  collapsed: ReadonlySet<string>;
  node: UnitTreeNode;
  onToggle: (unitId: string) => void;
}

const scopeHref = (
  props: Pick<NavigatorProps, "filter" | "orgSlug" | "view">,
  unitId: string | undefined
) =>
  `${workspacePath(props.orgSlug)}${workspaceQueryString({
    filter: {
      ...props.filter,
      page: 1,
      unitId: unitId as MemberFilter["unitId"],
    },
    view: props.view,
  })}`;

const UnitNode = (props: NodeProps) => {
  const { collapsed, node, onToggle } = props;
  const isCollapsed = collapsed.has(node.unit.id);
  const isActive = props.activeUnitId === node.unit.id;
  const toggle = () => onToggle(node.unit.id);
  return (
    <li>
      <div className="flex items-center gap-1">
        {node.children.length > 0 ? (
          <Button
            aria-expanded={!isCollapsed}
            aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${node.unit.name}`}
            onClick={toggle}
            size="icon-sm"
            variant="ghost"
          >
            <ChevronRight className={cn(isCollapsed ? "" : "rotate-90")} />
          </Button>
        ) : (
          <span aria-hidden className="size-7 shrink-0" />
        )}
        <Link
          aria-current={isActive ? "page" : undefined}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1 text-sm",
            isActive
              ? "bg-accent font-medium text-accent-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
          href={scopeHref(props, node.unit.id)}
          onClick={props.onNavigate}
        >
          <span className="truncate">{node.unit.name}</span>
          <span className="ml-auto text-xs tabular-nums">
            {node.subtreeCount}
          </span>
        </Link>
      </div>
      {node.children.length > 0 && !isCollapsed ? (
        <ul className="mt-0.5 ml-3 flex flex-col gap-0.5 border-border border-l pl-1">
          {node.children.map((child) => (
            <UnitNode {...props} key={child.unit.id} node={child} />
          ))}
        </ul>
      ) : null}
    </li>
  );
};

/**
 * The persistent scope navigator: selecting a node changes the scope of the
 * current workspace — never a route. Counts are subtree counts, because a
 * scope includes its descendants.
 */
export const UnitNavigator = (props: NavigatorProps) => {
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(new Set());
  const roots = buildUnitTree(props.units);

  const onToggle = (unitId: string) => {
    setCollapsed((previous) => {
      const next = new Set(previous);
      if (next.has(unitId)) {
        next.delete(unitId);
      } else {
        next.add(unitId);
      }
      return next;
    });
  };

  return (
    <nav aria-label="Organization structure">
      <ul className="flex flex-col gap-0.5">
        <li>
          <Link
            aria-current={props.activeUnitId === undefined ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1 text-sm",
              props.activeUnitId === undefined
                ? "bg-accent font-medium text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            href={scopeHref(props, undefined)}
            onClick={props.onNavigate}
          >
            <span>All people</span>
          </Link>
        </li>
        {roots.map((root) => (
          <UnitNode
            activeUnitId={props.activeUnitId}
            collapsed={collapsed}
            filter={props.filter}
            key={root.unit.id}
            node={root}
            onNavigate={props.onNavigate}
            onToggle={onToggle}
            orgSlug={props.orgSlug}
            view={props.view}
          />
        ))}
      </ul>
    </nav>
  );
};
