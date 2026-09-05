import type { MemberId, OrganizationId } from "@xforge/contracts/ids";
import type {
  Member,
  MemberFilter,
  MemberPage,
} from "@xforge/contracts/member/types";
import type { OrganizationUnitWithCount } from "@xforge/contracts/unit/types";
import { getDomainSources } from "@/lib/data";

export const listWorkspaceMembers = (
  organizationId: OrganizationId,
  filter: MemberFilter
): Promise<MemberPage> =>
  getDomainSources().members.list(organizationId, filter);

export const listUnits = (
  organizationId: OrganizationId
): Promise<OrganizationUnitWithCount[]> =>
  getDomainSources().units.list(organizationId);

export const getMember = (
  organizationId: OrganizationId,
  memberId: MemberId
): Promise<Member> => getDomainSources().members.get(organizationId, memberId);
