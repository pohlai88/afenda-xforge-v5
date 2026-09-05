import type { OrganizationSlug } from "../ids";
import type { Organization } from "./types";

/**
 * Narrow on purpose: the first screens only resolve a workspace from its URL
 * slug. `list` and `create` arrive with the screens that need them.
 */
export interface OrganizationSource {
  /** @throws DataSourceError NotFound when no organization has the slug. */
  getBySlug: (slug: OrganizationSlug) => Promise<Organization>;
}
