import type { MemberId, OrganizationId } from "../ids";
import type {
  InviteMemberInput,
  Member,
  MemberFilter,
  MemberPage,
  UpdateMemberRoleInput,
} from "./types";

/**
 * Tenant scope is part of every operation, not an optional filter: a member
 * outside `organizationId` is NotFound, never "found elsewhere".
 */
export interface MemberSource {
  /** Email must be unique within the organization → Conflict otherwise. */
  invite: (
    organizationId: OrganizationId,
    input: InviteMemberInput
  ) => Promise<Member>;
  list: (
    organizationId: OrganizationId,
    filter: MemberFilter
  ) => Promise<MemberPage>;
  /** Removing the last active owner → Invariant. */
  remove: (organizationId: OrganizationId, memberId: MemberId) => Promise<void>;
  /** Demoting the last active owner → Invariant. */
  updateRole: (
    organizationId: OrganizationId,
    memberId: MemberId,
    input: UpdateMemberRoleInput
  ) => Promise<Member>;
}
