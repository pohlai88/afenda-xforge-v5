import type { MemberFilter } from "@xforge/contracts/member/types";
import { Button, buttonVariants } from "@xforge/design/blocks/button";
import Link from "next/link";
import {
  type WorkspaceView,
  workspacePath,
  workspaceQueryString,
} from "../filter";

const pageLink = buttonVariants({ size: "sm", variant: "outline" });

export const WorkspacePagination = ({
  filter,
  memberId,
  orgSlug,
  total,
  view,
}: Readonly<{
  filter: MemberFilter;
  memberId: string | undefined;
  orgSlug: string;
  total: number;
  view: WorkspaceView;
}>) => {
  const pages = Math.max(1, Math.ceil(total / filter.pageSize));
  const href = (page: number) =>
    `${workspacePath(orgSlug)}${workspaceQueryString({
      filter: { ...filter, page },
      memberId,
      view,
    })}`;
  const first = total === 0 ? 0 : (filter.page - 1) * filter.pageSize + 1;
  const last = Math.min(total, filter.page * filter.pageSize);

  return (
    <nav
      aria-label="Pagination"
      className="mt-4 flex items-center justify-between"
    >
      <p className="text-muted-foreground text-sm tabular-nums">
        {first}–{last} of {total}
      </p>
      {pages > 1 ? (
        <div className="flex gap-2">
          {filter.page > 1 ? (
            <Link className={pageLink} href={href(filter.page - 1)}>
              Previous
            </Link>
          ) : (
            <Button disabled size="sm" variant="outline">
              Previous
            </Button>
          )}
          {filter.page < pages ? (
            <Link className={pageLink} href={href(filter.page + 1)}>
              Next
            </Link>
          ) : (
            <Button disabled size="sm" variant="outline">
              Next
            </Button>
          )}
        </div>
      ) : null}
    </nav>
  );
};
