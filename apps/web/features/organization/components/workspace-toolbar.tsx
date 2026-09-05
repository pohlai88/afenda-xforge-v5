import type { MemberFilter } from "@xforge/contracts/member/types";
import { cn } from "@xforge/design/lib/utils";
import Link from "next/link";
import {
  type WorkspaceView,
  workspacePath,
  workspaceQueryString,
  workspaceViews,
} from "../filter";

const viewLabels: Readonly<Record<WorkspaceView, string>> = {
  chart: "Org chart",
  people: "People",
  positions: "Positions",
};

/** View switching stays on the page: same scope, same filters, another surface. */
export const WorkspaceToolbar = ({
  filter,
  orgSlug,
  view,
}: Readonly<{
  filter: MemberFilter;
  orgSlug: string;
  view: WorkspaceView;
}>) => (
  <nav aria-label="Workspace views" className="border-border border-b">
    <ul className="flex gap-1">
      {workspaceViews.map((candidate) => {
        const isCurrent = candidate === view;
        return (
          <li key={candidate}>
            <Link
              aria-current={isCurrent ? "page" : undefined}
              className={cn(
                "-mb-px inline-block border-b-2 px-3 py-2 text-sm",
                isCurrent
                  ? "border-primary font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              href={`${workspacePath(orgSlug)}${workspaceQueryString({
                filter: { ...filter, page: 1 },
                view: candidate,
              })}`}
            >
              {viewLabels[candidate]}
            </Link>
          </li>
        );
      })}
    </ul>
  </nav>
);
