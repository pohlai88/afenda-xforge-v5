import type { OrganizationId } from "../ids";
import type { OrganizationUnitWithCount } from "./types";

/**
 * Narrow on purpose: the organization workspace only reads the structure to
 * scope its views. `create`, `update` and `archive` arrive with the screens
 * that need them, with contract tests in the same commit.
 */
export interface OrganizationUnitSource {
  /** Every unit of the organization, flat — screens build the tree. */
  list: (
    organizationId: OrganizationId
  ) => Promise<OrganizationUnitWithCount[]>;
}
