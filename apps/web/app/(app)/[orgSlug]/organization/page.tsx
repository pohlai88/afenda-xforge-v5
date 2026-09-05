import { isDataSourceError } from "@xforge/contracts/errors";
import { organizationSlugSchema } from "@xforge/contracts/ids";
import type { Member } from "@xforge/contracts/member/types";
import type { Metadata } from "next";
import { PageHeader } from "@/components/app-shell/page-header";
import { InviteMemberDialog } from "@/features/members/components/invite-member-dialog";
import { MembersEmptyState } from "@/features/members/components/members-empty-state";
import { MemberInspector } from "@/features/organization/components/member-inspector";
import { OrgChart } from "@/features/organization/components/org-chart";
import { PeopleView } from "@/features/organization/components/people-view";
import { PositionsPlaceholder } from "@/features/organization/components/positions-placeholder";
import { UnitNavigator } from "@/features/organization/components/unit-navigator";
import { UnitNavigatorSheet } from "@/features/organization/components/unit-navigator-sheet";
import { WorkspaceFilters } from "@/features/organization/components/workspace-filters";
import {
  inspectorHref,
  workspaceHref,
} from "@/features/organization/components/workspace-links";
import { WorkspacePagination } from "@/features/organization/components/workspace-pagination";
import { WorkspaceToolbar } from "@/features/organization/components/workspace-toolbar";
import {
  parseWorkspaceQuery,
  type SearchParams,
} from "@/features/organization/filter";
import {
  getMember,
  listUnits,
  listWorkspaceMembers,
} from "@/features/organization/queries";
import { getDomainSources } from "@/lib/data";

export const metadata: Metadata = {
  title: "Organization",
};

/**
 * A stale or foreign `?member=` is view state, not a resource: it normalises
 * to a closed inspector, the same way an invalid `?page=` normalises to 1.
 * Anything but NotFound is operational and reaches error.tsx.
 */
const inspectedOrUndefined = async (
  read: Promise<Member>
): Promise<Member | undefined> => {
  try {
    return await read;
  } catch (error) {
    if (isDataSourceError(error) && error.code === "NotFound") {
      return undefined;
    }
    throw error;
  }
};

export default async function OrganizationPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ orgSlug: string }>;
  searchParams: Promise<SearchParams>;
}>) {
  const [{ orgSlug }, query] = await Promise.all([params, searchParams]);
  const { filter, memberId, view } = parseWorkspaceQuery(query);
  const organization = await getDomainSources().organizations.getBySlug(
    organizationSlugSchema.parse(orgSlug)
  );
  const [units, page, inspected] = await Promise.all([
    listUnits(organization.id),
    listWorkspaceMembers(organization.id, filter),
    memberId
      ? inspectedOrUndefined(getMember(organization.id, memberId))
      : Promise.resolve(undefined),
  ]);

  const { slug } = organization;
  const isFiltered = Boolean(
    filter.query || filter.role || filter.status || filter.unitId
  );
  const empty = page.total === 0 && !isFiltered && units.length === 0;
  const inspectedIndex = inspected
    ? page.items.findIndex((member) => member.id === inspected.id)
    : -1;
  const neighbor = (offset: number): string | undefined => {
    const candidate =
      inspectedIndex === -1 ? undefined : page.items[inspectedIndex + offset];
    return candidate ? inspectorHref(slug, filter, candidate.id) : undefined;
  };

  return (
    <>
      <PageHeader
        actions={<InviteMemberDialog orgSlug={slug} />}
        description="Structure and people of this workspace — one page, no detours"
        title="Organization"
      />
      <WorkspaceToolbar filter={filter} orgSlug={slug} view={view} />
      {empty ? (
        <div className="mt-6">
          <MembersEmptyState orgSlug={slug} />
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-6 lg:flex-row">
          <aside className="hidden lg:block lg:w-56 lg:shrink-0">
            <UnitNavigator
              activeUnitId={filter.unitId}
              filter={filter}
              orgSlug={slug}
              units={units}
              view={view}
            />
          </aside>
          <div className="min-w-0 flex-1">
            <div className="mb-4 lg:hidden">
              <UnitNavigatorSheet
                activeUnitId={filter.unitId}
                filter={filter}
                orgSlug={slug}
                units={units}
                view={view}
              />
            </div>
            {view === "people" ? (
              <>
                <div className="mb-4">
                  <WorkspaceFilters
                    filter={filter}
                    memberId={inspected?.id}
                    orgSlug={slug}
                    view={view}
                  />
                </div>
                <PeopleView
                  filter={filter}
                  inspectedMemberId={inspected?.id}
                  members={page.items}
                  orgSlug={slug}
                  units={units}
                >
                  <WorkspacePagination
                    filter={filter}
                    memberId={inspected?.id}
                    orgSlug={slug}
                    total={page.total}
                    view={view}
                  />
                </PeopleView>
              </>
            ) : null}
            {view === "chart" ? (
              <OrgChart filter={filter} orgSlug={slug} units={units} />
            ) : null}
            {view === "positions" ? <PositionsPlaceholder /> : null}
          </div>
          {inspected && view === "people" ? (
            <div className="w-full lg:w-96 lg:shrink-0">
              <MemberInspector
                closeHref={workspaceHref(slug, filter, view)}
                member={inspected}
                nextHref={neighbor(1)}
                orgSlug={slug}
                prevHref={neighbor(-1)}
                unitName={
                  units.find((unit) => unit.id === inspected.unitId)?.name
                }
                units={units}
              />
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}
