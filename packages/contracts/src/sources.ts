import type { MemberSource } from "./member/source";
import type { OrganizationSource } from "./organization/source";

/**
 * Everything the application reads or writes goes through these. Screens
 * receive an instance from `getDomainSources()`; they never learn which
 * adapter (fixtures, database, HTTP) is behind it.
 */
export interface DomainSources {
  members: MemberSource;
  organizations: OrganizationSource;
}
