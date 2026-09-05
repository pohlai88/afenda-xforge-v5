import { beforeEach, describe, expect, it } from "vitest";
import { type DataSourceErrorCode, isDataSourceError } from "../errors";
import { acmeMembers, northwindMembers } from "../fixtures/members";
import { organizations } from "../fixtures/organizations";
import { memberIdSchema } from "../ids";
import type { DomainSources } from "../sources";
import { memberFilterSchema } from "./schema";
import type { Member } from "./types";

type Outcome = DataSourceErrorCode | "none" | "unexpected";

const outcomeOf = async (attempt: () => Promise<unknown>): Promise<Outcome> => {
  try {
    await attempt();
    return "none";
  } catch (error) {
    return isDataSourceError(error) ? error.code : "unexpected";
  }
};

const filter = (overrides: Record<string, unknown> = {}) =>
  memberFilterSchema.parse(overrides);

const byEmail = (members: readonly Member[], email: string): Member => {
  const found = members.find((member) => member.email === email);
  if (!found) {
    throw new Error(`fixture missing: ${email}`);
  }
  return found;
};

/**
 * The executable contract for MemberSource. Any adapter must pass it, seeded
 * with the canonical fixtures. `makeSources` must return a FRESH, isolated
 * instance on every call — the suite mutates state.
 */
export const runMemberContract = (
  makeSources: () => DomainSources | Promise<DomainSources>
) => {
  describe("MemberSource contract", () => {
    let sources: DomainSources;
    const acme = organizations.acme.id;
    const northwind = organizations.northwind.id;
    const ada = byEmail(acmeMembers, "ada@acme.example");
    const grace = byEmail(acmeMembers, "grace@acme.example");
    const annie = byEmail(northwindMembers, "annie@northwind.example");
    const mary = byEmail(northwindMembers, "mary@northwind.example");

    beforeEach(async () => {
      sources = await makeSources();
    });

    describe("tenant scope", () => {
      it("lists only the organization's own members", async () => {
        const page = await sources.members.list(acme, filter());
        expect(page.total).toBe(acmeMembers.length);
        expect(page.items.every((m) => m.organizationId === acme)).toBe(true);
      });

      it("cannot update another organization's member", async () => {
        const outcome = await outcomeOf(() =>
          sources.members.updateRole(acme, mary.id, { role: "admin" })
        );
        expect(outcome).toBe("NotFound");
      });

      it("cannot remove another organization's member, and leaves it intact", async () => {
        expect(
          await outcomeOf(() => sources.members.remove(acme, mary.id))
        ).toBe("NotFound");
        const page = await sources.members.list(northwind, filter());
        expect(page.total).toBe(northwindMembers.length);
      });

      it("returns an empty page for an organization with no members", async () => {
        const page = await sources.members.list(
          organizations.blankCo.id,
          filter()
        );
        expect(page).toMatchObject({ items: [], total: 0 });
      });
    });

    describe("invite", () => {
      it("adds an invited member to the organization", async () => {
        const member = await sources.members.invite(acme, {
          email: "new@acme.example",
          name: "New Person",
          role: "member",
        });
        expect(member).toMatchObject({
          email: "new@acme.example",
          organizationId: acme,
          role: "member",
          status: "invited",
        });
        expect(memberIdSchema.safeParse(member.id).success).toBe(true);
        const page = await sources.members.list(acme, filter());
        expect(page.total).toBe(acmeMembers.length + 1);
      });

      it("rejects an email already used in the same organization", async () => {
        const outcome = await outcomeOf(() =>
          sources.members.invite(acme, {
            email: ada.email,
            name: "Duplicate",
            role: "member",
          })
        );
        expect(outcome).toBe("Conflict");
      });

      it("allows the same email in a different organization", async () => {
        const outcome = await outcomeOf(() =>
          sources.members.invite(northwind, {
            email: ada.email,
            name: "Ada elsewhere",
            role: "member",
          })
        );
        expect(outcome).toBe("none");
      });
    });

    describe("last active owner", () => {
      it("cannot be removed", async () => {
        expect(
          await outcomeOf(() => sources.members.remove(northwind, annie.id))
        ).toBe("Invariant");
      });

      it("cannot be demoted", async () => {
        const outcome = await outcomeOf(() =>
          sources.members.updateRole(northwind, annie.id, { role: "admin" })
        );
        expect(outcome).toBe("Invariant");
      });

      it("is only protected once the other owners are gone", async () => {
        const demoted = await sources.members.updateRole(acme, ada.id, {
          role: "admin",
        });
        expect(demoted.role).toBe("admin");
        const outcome = await outcomeOf(() =>
          sources.members.updateRole(acme, grace.id, { role: "admin" })
        );
        expect(outcome).toBe("Invariant");
      });
    });

    describe("unknown member", () => {
      const ghost = memberIdSchema.parse("mem_9999");

      it("is NotFound on updateRole", async () => {
        const outcome = await outcomeOf(() =>
          sources.members.updateRole(acme, ghost, { role: "admin" })
        );
        expect(outcome).toBe("NotFound");
      });

      it("is NotFound on remove", async () => {
        expect(await outcomeOf(() => sources.members.remove(acme, ghost))).toBe(
          "NotFound"
        );
      });
    });

    describe("filtering and pagination", () => {
      it("filters by role and status, counting the filtered set", async () => {
        const owners = await sources.members.list(
          acme,
          filter({ role: "owner" })
        );
        expect(owners.total).toBe(2);
        const invited = await sources.members.list(
          acme,
          filter({ status: "invited" })
        );
        expect(invited.total).toBe(1);
      });

      it("matches query against name and email, case-insensitively", async () => {
        const byName = await sources.members.list(
          acme,
          filter({ query: "ADA" })
        );
        expect(byName.items.map((m) => m.email)).toEqual([ada.email]);
        const byMail = await sources.members.list(
          acme,
          filter({ query: "grace@" })
        );
        expect(byMail.total).toBe(1);
      });

      it("pages with the requested size and reports the full total", async () => {
        await Promise.all(
          [0, 1, 2].map((n) =>
            sources.members.invite(acme, {
              email: `extra-${n}@acme.example`,
              name: `Extra ${n}`,
              role: "member",
            })
          )
        );
        const first = await sources.members.list(
          acme,
          filter({ pageSize: 10 })
        );
        const second = await sources.members.list(
          acme,
          filter({ page: 2, pageSize: 10 })
        );
        expect(first.items).toHaveLength(10);
        expect(first.total).toBe(acmeMembers.length + 3);
        expect(second.items).toHaveLength(1);
        expect(second).toMatchObject({ page: 2, pageSize: 10 });
      });
    });
  });
};
