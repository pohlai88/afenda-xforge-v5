import type { OrganizationId } from "@xforge/contracts/ids";
import type { MemberFilter, MemberPage } from "@xforge/contracts/member/types";
import { getDomainSources } from "@/lib/data";

export const listMembers = (
  organizationId: OrganizationId,
  filter: MemberFilter
): Promise<MemberPage> =>
  getDomainSources().members.list(organizationId, filter);
