import { organizationIdSchema, organizationSlugSchema } from "../ids";
import type { Organization } from "../organization/types";
import { dayAfterEpoch, id } from "./seed";

const make = (n: number, slug: string, name: string): Organization => ({
  createdAt: dayAfterEpoch(n),
  id: organizationIdSchema.parse(id("org", n)),
  name,
  slug: organizationSlugSchema.parse(slug),
});

/**
 * The canonical workspaces. Three ordinary organizations — valid domain
 * state only. Failure is never a fixture; adapters inject faults (see
 * apps/web/lib/data/adapters/fixtures/faults.ts).
 *
 *  acme       populated: two active owners, admins, members, one invitee
 *  blank-co   no members at all — the empty state
 *  northwind  exactly one active owner — the last-owner invariant
 */
export const organizations = {
  acme: make(1, "acme", "Acme Industries"),
  blankCo: make(2, "blank-co", "Blank Co"),
  northwind: make(3, "northwind", "Northwind Traders"),
} as const;

export const organizationList: readonly Organization[] =
  Object.values(organizations);
