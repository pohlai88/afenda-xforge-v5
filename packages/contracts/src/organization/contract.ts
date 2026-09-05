import { beforeEach, describe, expect, it } from "vitest";
import { isDataSourceError } from "../errors";
import { organizations } from "../fixtures/organizations";
import { organizationSlugSchema } from "../ids";
import type { DomainSources } from "../sources";

/**
 * The executable contract for OrganizationSource. Any adapter must pass it,
 * seeded with the canonical fixtures (`fixtures/organizations`).
 */
export const runOrganizationContract = (
  makeSources: () => DomainSources | Promise<DomainSources>
) => {
  describe("OrganizationSource contract", () => {
    let sources: DomainSources;

    beforeEach(async () => {
      sources = await makeSources();
    });

    it("resolves a seeded organization by slug", async () => {
      const organization = await sources.organizations.getBySlug(
        organizations.acme.slug
      );
      expect(organization).toEqual(organizations.acme);
    });

    it("raises NotFound for an unknown slug", async () => {
      const slug = organizationSlugSchema.parse("no-such-workspace");
      const failure = await Promise.resolve()
        .then(() => sources.organizations.getBySlug(slug))
        .catch((error: unknown) => error);
      expect(isDataSourceError(failure)).toBe(true);
      expect(isDataSourceError(failure) && failure.code).toBe("NotFound");
    });
  });
};
