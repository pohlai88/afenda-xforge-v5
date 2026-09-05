import type { MemberFilter } from "@xforge/contracts/member/types";
import { Button } from "@xforge/design/components/button";
import Link from "next/link";
import { memberListQueryString } from "../filter";

export const MembersPagination = ({
  filter,
  pathname,
  total,
}: Readonly<{ filter: MemberFilter; pathname: string; total: number }>) => {
  const pages = Math.max(1, Math.ceil(total / filter.pageSize));
  const href = (page: number) =>
    `${pathname}${memberListQueryString({ ...filter, page })}`;
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
      <div className="flex gap-2">
        {filter.page > 1 ? (
          <Button asChild size="sm" variant="outline">
            <Link href={href(filter.page - 1)}>Previous</Link>
          </Button>
        ) : (
          <Button disabled size="sm" variant="outline">
            Previous
          </Button>
        )}
        {filter.page < pages ? (
          <Button asChild size="sm" variant="outline">
            <Link href={href(filter.page + 1)}>Next</Link>
          </Button>
        ) : (
          <Button disabled size="sm" variant="outline">
            Next
          </Button>
        )}
      </div>
    </nav>
  );
};
