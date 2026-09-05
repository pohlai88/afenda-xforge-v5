import { memberFilterSchema } from "@xforge/contracts/member/schema";
import type { MemberFilter } from "@xforge/contracts/member/types";

export type SearchParams = Record<string, string | string[] | undefined>;

const keys = ["page", "pageSize", "query", "role", "status"] as const;

/**
 * URL → MemberFilter. The URL is user-editable, so invalid values normalise
 * to defaults instead of turning `?page=abc` into a route error; repeated
 * keys take the first value.
 */
export const parseMemberListQuery = (
  searchParams: SearchParams
): MemberFilter => {
  const accepted: Record<string, string> = {};
  for (const key of keys) {
    const raw = searchParams[key];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (value === undefined || value === "") {
      continue;
    }
    if (memberFilterSchema.shape[key].safeParse(value).success) {
      accepted[key] = value;
    }
  }
  return memberFilterSchema.parse(accepted);
};

/** MemberFilter → URL query, omitting defaults so links stay short. */
export const memberListQueryString = (
  filter: Partial<MemberFilter>
): string => {
  const params = new URLSearchParams();
  if (filter.query) {
    params.set("query", filter.query);
  }
  if (filter.role) {
    params.set("role", filter.role);
  }
  if (filter.status) {
    params.set("status", filter.status);
  }
  if (filter.page && filter.page > 1) {
    params.set("page", String(filter.page));
  }
  if (filter.pageSize && filter.pageSize !== 25) {
    params.set("pageSize", String(filter.pageSize));
  }
  const query = params.toString();
  return query ? `?${query}` : "";
};
