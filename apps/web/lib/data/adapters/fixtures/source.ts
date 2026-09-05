import { DataSourceError } from "@xforge/contracts/errors";
import { id } from "@xforge/contracts/fixtures/seed";
import {
  type MemberId,
  memberIdSchema,
  type OrganizationId,
} from "@xforge/contracts/ids";
import type { MemberSource } from "@xforge/contracts/member/source";
import type { Member, MemberFilter } from "@xforge/contracts/member/types";
import type { OrganizationSource } from "@xforge/contracts/organization/source";
import type { Organization } from "@xforge/contracts/organization/types";
import type { DomainSources } from "@xforge/contracts/sources";
import { type FaultOperation, type FaultSpec, throwIfFaulted } from "./faults";
import { createFixtureStore, type FixtureStore } from "./store";

/** Runs a sync body as a promise so a thrown DataSourceError becomes a rejection. */
const run = <T>(body: () => T): Promise<T> =>
  new Promise((resolve) => resolve(body()));

export interface FixtureOptions {
  faults?: readonly FaultSpec[];
  store?: FixtureStore;
}

const matchesFilter = (member: Member, filter: MemberFilter) => {
  if (filter.role && member.role !== filter.role) {
    return false;
  }
  if (filter.status && member.status !== filter.status) {
    return false;
  }
  if (filter.query) {
    const needle = filter.query.toLowerCase();
    return (
      member.name.toLowerCase().includes(needle) ||
      member.email.toLowerCase().includes(needle)
    );
  }
  return true;
};

/**
 * ALWAYS a fresh, isolated instance. Tests build one per case; the dev server
 * keeps one via `getFixtureDomainSources()` (index.ts). All tenant checks live
 * here — the store is just maps.
 */
export const createFixtureDomainSources = (
  options: FixtureOptions = {}
): DomainSources => {
  const store = options.store ?? createFixtureStore();
  const faults = options.faults ?? [];

  const organizationOf = (organizationId: OrganizationId): Organization => {
    const organization = store.organizations.get(organizationId);
    if (!organization) {
      throw new DataSourceError("NotFound", "Organization not found");
    }
    return organization;
  };

  const guard = (operation: FaultOperation, organizationId: OrganizationId) =>
    throwIfFaulted(faults, operation, organizationOf(organizationId).slug);

  /** Tenant scope: a member outside the organization is NotFound, not "elsewhere". */
  const memberOf = (
    organizationId: OrganizationId,
    memberId: MemberId
  ): Member => {
    const member = store.members.get(memberId);
    if (!member || member.organizationId !== organizationId) {
      throw new DataSourceError("NotFound", "Member not found");
    }
    return member;
  };

  const activeOwners = (organizationId: OrganizationId) =>
    [...store.members.values()].filter(
      (member) =>
        member.organizationId === organizationId &&
        member.role === "owner" &&
        member.status === "active"
    );

  const assertNotLastActiveOwner = (member: Member) => {
    const isActiveOwner = member.role === "owner" && member.status === "active";
    if (isActiveOwner && activeOwners(member.organizationId).length === 1) {
      throw new DataSourceError(
        "Invariant",
        "An organization must keep at least one active owner"
      );
    }
  };

  const organizations: OrganizationSource = {
    getBySlug: (slug) =>
      run(() => {
        throwIfFaulted(faults, "organizations.getBySlug", slug);
        const organization = [...store.organizations.values()].find(
          (candidate) => candidate.slug === slug
        );
        if (!organization) {
          throw new DataSourceError("NotFound", "Organization not found");
        }
        return organization;
      }),
  };

  const members: MemberSource = {
    invite: (organizationId, input) =>
      run(() => {
        guard("members.invite", organizationId);
        const email = input.email.toLowerCase();
        const taken = [...store.members.values()].some(
          (candidate) =>
            candidate.organizationId === organizationId &&
            candidate.email.toLowerCase() === email
        );
        if (taken) {
          throw new DataSourceError(
            "Conflict",
            "A member with this email already exists",
            {
              field: "email",
            }
          );
        }
        store.nextMemberNumber += 1;
        const member: Member = {
          email: input.email,
          id: memberIdSchema.parse(id("mem", store.nextMemberNumber)),
          joinedAt: new Date().toISOString(),
          name: input.name,
          organizationId,
          role: input.role,
          status: "invited",
        };
        store.members.set(member.id, member);
        return member;
      }),

    list: (organizationId, filter) =>
      run(() => {
        guard("members.list", organizationId);
        const matching = [...store.members.values()]
          .filter((member) => member.organizationId === organizationId)
          .filter((member) => matchesFilter(member, filter))
          .sort((a, b) => a.joinedAt.localeCompare(b.joinedAt));
        const start = (filter.page - 1) * filter.pageSize;
        return {
          items: matching.slice(start, start + filter.pageSize),
          page: filter.page,
          pageSize: filter.pageSize,
          total: matching.length,
        };
      }),

    remove: (organizationId, memberId) =>
      run(() => {
        guard("members.remove", organizationId);
        const member = memberOf(organizationId, memberId);
        assertNotLastActiveOwner(member);
        store.members.delete(memberId);
      }),

    updateRole: (organizationId, memberId, input) =>
      run(() => {
        guard("members.updateRole", organizationId);
        const member = memberOf(organizationId, memberId);
        if (input.role !== "owner") {
          assertNotLastActiveOwner(member);
        }
        const updated: Member = { ...member, role: input.role };
        store.members.set(memberId, updated);
        return updated;
      }),
  };

  return { members, organizations };
};
