import { memberList } from "@xforge/contracts/fixtures/members";
import { organizationList } from "@xforge/contracts/fixtures/organizations";
import type { MemberId, OrganizationId } from "@xforge/contracts/ids";
import type { Member } from "@xforge/contracts/member/types";
import type { Organization } from "@xforge/contracts/organization/types";

export interface FixtureStore {
  members: Map<MemberId, Member>;
  nextMemberNumber: number;
  organizations: Map<OrganizationId, Organization>;
}

/** A fresh, deep-copied world from the canonical fixtures. Never shared. */
export const createFixtureStore = (): FixtureStore => ({
  members: new Map(memberList.map((member) => [member.id, { ...member }])),
  nextMemberNumber: 1000,
  organizations: new Map(
    organizationList.map((organization) => [
      organization.id,
      { ...organization },
    ])
  ),
});
