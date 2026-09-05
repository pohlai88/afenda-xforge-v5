import { DataSourceError } from "@xforge/contracts/errors";
import { id } from "@xforge/contracts/fixtures/seed";
import {
  type MemberId,
  memberIdSchema,
  type OrganizationId,
  type OrganizationUnitId,
} from "@xforge/contracts/ids";
import type { MemberSource } from "@xforge/contracts/member/source";
import type { Member, MemberFilter } from "@xforge/contracts/member/types";
import type { OrganizationSource } from "@xforge/contracts/organization/source";
import type { Organization } from "@xforge/contracts/organization/types";
import type { DomainSources } from "@xforge/contracts/sources";
import type { OrganizationUnitSource } from "@xforge/contracts/unit/source";
import type { OrganizationUnit } from "@xforge/contracts/unit/types";
import { type FaultOperation, type FaultSpec, throwIfFaulted } from "./faults";
import { createFixtureStore, type FixtureStore } from "./store";

/** Runs a sync body as a promise so a thrown DataSourceError becomes a rejection. */
const run = <T>(body: () => T): Promise<T> =>
  new Promise((resolve) => resolve(body()));

export interface FixtureOptions {
  faults?: readonly FaultSpec[];
  store?: FixtureStore;
}

const matchesFilter = (
  member: Member,
  filter: MemberFilter,
  scope: ReadonlySet<OrganizationUnitId> | undefined
) => {
  if (scope && (member.unitId === null || !scope.has(member.unitId))) {
    return false;
  }
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
      member.email.toLowerCase().includes(needle) ||
      (member.title?.toLowerCase().includes(needle) ?? false)
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

  /** Tenant scope for structure: a unit outside the organization is NotFound. */
  const unitOf = (
    organizationId: OrganizationId,
    unitId: OrganizationUnitId
  ): OrganizationUnit => {
    const unit = store.units.get(unitId);
    if (!unit || unit.organizationId !== organizationId) {
      throw new DataSourceError("NotFound", "Organization unit not found");
    }
    return unit;
  };

  const unitsOfOrganization = (organizationId: OrganizationId) =>
    [...store.units.values()].filter(
      (unit) => unit.organizationId === organizationId
    );

  /** The unit and every descendant — the tree is a scope, not a filter chip. */
  const subtreeOf = (
    organizationId: OrganizationId,
    rootId: OrganizationUnitId
  ): ReadonlySet<OrganizationUnitId> => {
    const children = new Map<OrganizationUnitId, OrganizationUnitId[]>();
    for (const unit of unitsOfOrganization(organizationId)) {
      if (unit.parentId !== null) {
        const siblings = children.get(unit.parentId) ?? [];
        siblings.push(unit.id);
        children.set(unit.parentId, siblings);
      }
    }
    const scope = new Set<OrganizationUnitId>();
    const root = store.units.get(rootId);
    if (!root || root.organizationId !== organizationId) {
      return scope; // A foreign scope matches nobody; it never leaks.
    }
    const queue: OrganizationUnitId[] = [rootId];
    while (queue.length > 0) {
      const next = queue.pop();
      if (next === undefined || scope.has(next)) {
        continue;
      }
      scope.add(next);
      queue.push(...(children.get(next) ?? []));
    }
    return scope;
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

  const units: OrganizationUnitSource = {
    list: (organizationId) =>
      run(() => {
        guard("units.list", organizationId);
        const own = [...store.members.values()].filter(
          (member) => member.organizationId === organizationId
        );
        return unitsOfOrganization(organizationId).map((unit) => ({
          ...unit,
          memberCount: own.filter((member) => member.unitId === unit.id).length,
        }));
      }),
  };

  const members: MemberSource = {
    get: (organizationId, memberId) =>
      run(() => {
        guard("members.get", organizationId);
        return { ...memberOf(organizationId, memberId) };
      }),

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
          title: null,
          unitId: null,
        };
        store.members.set(member.id, member);
        return member;
      }),

    list: (organizationId, filter) =>
      run(() => {
        guard("members.list", organizationId);
        const scope = filter.unitId
          ? subtreeOf(organizationId, filter.unitId)
          : undefined;
        const matching = [...store.members.values()]
          .filter((member) => member.organizationId === organizationId)
          .filter((member) => matchesFilter(member, filter, scope))
          .sort((a, b) => a.joinedAt.localeCompare(b.joinedAt));
        const start = (filter.page - 1) * filter.pageSize;
        return {
          items: matching.slice(start, start + filter.pageSize),
          page: filter.page,
          pageSize: filter.pageSize,
          total: matching.length,
        };
      }),

    move: (organizationId, input) =>
      run(() => {
        guard("members.move", organizationId);
        const unit = unitOf(organizationId, input.unitId);
        // Resolve everyone before writing anyone — the move is atomic.
        const moving = input.memberIds.map((memberId) =>
          memberOf(organizationId, memberId)
        );
        return moving.map((member) => {
          const updated: Member = { ...member, unitId: unit.id };
          store.members.set(member.id, updated);
          return updated;
        });
      }),

    remove: (organizationId, memberId) =>
      run(() => {
        guard("members.remove", organizationId);
        const member = memberOf(organizationId, memberId);
        assertNotLastActiveOwner(member);
        store.members.delete(memberId);
      }),

    update: (organizationId, memberId, input) =>
      run(() => {
        guard("members.update", organizationId);
        const member = memberOf(organizationId, memberId);
        if (input.unitId !== null) {
          unitOf(organizationId, input.unitId);
        }
        const updated: Member = {
          ...member,
          name: input.name,
          title: input.title,
          unitId: input.unitId,
        };
        store.members.set(memberId, updated);
        return updated;
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

  return { members, organizations, units };
};
