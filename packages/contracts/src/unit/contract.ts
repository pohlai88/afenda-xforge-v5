import { beforeEach, describe, expect, it } from "vitest";
import { acmeMembers } from "../fixtures/members";
import { organizations } from "../fixtures/organizations";
import { acmeUnits } from "../fixtures/units";
import type { DomainSources } from "../sources";
import { organizationUnitWithCountSchema } from "./schema";

/**
 * The executable contract for OrganizationUnitSource. Any adapter must pass
 * it, seeded with the canonical fixtures. `makeSources` must return a FRESH,
 * isolated instance on every call.
 */
export const runOrganizationUnitContract = (
  makeSources: () => DomainSources | Promise<DomainSources>
) => {
  describe("OrganizationUnitSource contract", () => {
    let sources: DomainSources;
    const acme = organizations.acme.id;

    beforeEach(async () => {
      sources = await makeSources();
    });

    it("lists only the organization's own units, every one valid", async () => {
      const units = await sources.units.list(acme);
      expect(units).toHaveLength(acmeUnits.length);
      for (const unit of units) {
        expect(organizationUnitWithCountSchema.safeParse(unit).success).toBe(
          true
        );
        expect(unit.organizationId).toBe(acme);
      }
    });

    it("returns an empty list for an organization without structure", async () => {
      const units = await sources.units.list(organizations.blankCo.id);
      expect(units).toEqual([]);
    });

    it("keeps every parent reference inside the listed set", async () => {
      const units = await sources.units.list(acme);
      const ids = new Set(units.map((unit) => unit.id));
      for (const unit of units) {
        if (unit.parentId !== null) {
          expect(ids.has(unit.parentId)).toBe(true);
        }
      }
    });

    it("derives direct member counts from the members it serves", async () => {
      const units = await sources.units.list(acme);
      for (const unit of units) {
        const direct = acmeMembers.filter(
          (member) => member.unitId === unit.id
        ).length;
        expect(unit.memberCount, unit.name).toBe(direct);
      }
      // One hand-pinned anchor so the derivation above cannot rot silently.
      const support = units.find((unit) => unit.name === "Support");
      expect(support?.memberCount).toBe(2);
    });
  });
};
