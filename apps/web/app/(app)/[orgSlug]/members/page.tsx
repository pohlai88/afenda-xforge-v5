import { organizationSlugSchema } from "@xforge/contracts/ids";
import type { Metadata } from "next";
import { PageHeader } from "@/components/app-shell/page-header";
import { InviteMemberDialog } from "@/features/members/components/invite-member-dialog";
import { MembersEmptyState } from "@/features/members/components/members-empty-state";
import { MembersFilters } from "@/features/members/components/members-filters";
import { MembersPagination } from "@/features/members/components/members-pagination";
import { MembersTable } from "@/features/members/components/members-table";
import {
  parseMemberListQuery,
  type SearchParams,
} from "@/features/members/filter";
import { listMembers } from "@/features/members/queries";
import { getDomainSources } from "@/lib/data";

export const metadata: Metadata = {
  title: "Members",
};

const isFiltered = (filter: ReturnType<typeof parseMemberListQuery>) =>
  Boolean(filter.query || filter.role || filter.status);

export default async function MembersPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ orgSlug: string }>;
  searchParams: Promise<SearchParams>;
}>) {
  const [{ orgSlug }, query] = await Promise.all([params, searchParams]);
  const filter = parseMemberListQuery(query);
  const organization = await getDomainSources().organizations.getBySlug(
    organizationSlugSchema.parse(orgSlug)
  );
  const page = await listMembers(organization.id, filter);
  const pathname = `/${organization.slug}/members`;
  const empty = page.total === 0 && !isFiltered(filter);

  return (
    <>
      <PageHeader
        actions={<InviteMemberDialog orgSlug={organization.slug} />}
        description="People in this workspace"
        title="Members"
      />
      {empty ? (
        <MembersEmptyState orgSlug={organization.slug} />
      ) : (
        <>
          <MembersFilters filter={filter} />
          <MembersTable members={page.items} orgSlug={organization.slug} />
          <MembersPagination
            filter={filter}
            pathname={pathname}
            total={page.total}
          />
        </>
      )}
    </>
  );
}
