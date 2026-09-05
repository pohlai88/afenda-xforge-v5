import type { MemberId, OrganizationId } from "../ids";
import type {
  InviteMemberInput,
  Member,
  MemberFilter,
  MemberPage,
  MoveMembersInput,
  UpdateMemberInput,
  UpdateMemberRoleInput,
} from "./types";

/**
 * Tenant scope is part of every operation, not an optional filter: a member
 * outside `organizationId` is NotFound, never "found elsewhere".
 */
export interface MemberSource {
  get: (organizationId: OrganizationId, memberId: MemberId) => Promise<Member>;
  /** Email must be unique within the organization → Conflict otherwise. */
  invite: (
    organizationId: OrganizationId,
    input: InviteMemberInput
  ) => Promise<Member>;
  list: (
    organizationId: OrganizationId,
    filter: MemberFilter
  ) => Promise<MemberPage>;
  /**
   * Atomic: every member and the target unit must belong to the organization
   * or nobody moves (NotFound). Returns the members in their new state.
   */
  move: (
    organizationId: OrganizationId,
    input: MoveMembersInput
  ) => Promise<Member[]>;
  /** Removing the last active owner → Invariant. */
  remove: (organizationId: OrganizationId, memberId: MemberId) => Promise<void>;
  /** A `unitId` outside the organization → NotFound. */
  update: (
    organizationId: OrganizationId,
    memberId: MemberId,
    input: UpdateMemberInput
  ) => Promise<Member>;
  /** Demoting the last active owner → Invariant. */
  updateRole: (
    organizationId: OrganizationId,
    memberId: MemberId,
    input: UpdateMemberRoleInput
  ) => Promise<Member>;
}
