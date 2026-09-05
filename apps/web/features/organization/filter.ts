import { type MemberId, memberIdSchema } from "@xforge/contracts/ids";
import { memberFilterSchema } from "@xforge/contracts/member/schema";
import type { MemberFilter } from "@xforge/contracts/member/types";

export type SearchParams = Record<string, string | string[] | undefined>;

export const workspaceViews = ["people", "chart", "positions"] as const;
export type WorkspaceView = (typeof workspaceViews)[number];

const filterKeys = ["page", "pageSize", "query", "role", "status"] as const;

export interface WorkspaceQuery {
  filter: MemberFilter;
  memberId: MemberId | undefined;
  view: WorkspaceView;
}

const firstOf = (searchParams: SearchParams, key: string) => {
  const raw = searchParams[key];
  return Array.isArray(raw) ? raw[0] : raw;
};

const isView = (value: string | undefined): value is WorkspaceView =>
  (workspaceViews as readonly string[]).includes(value ?? "");

/**
 * URL → workspace state. The URL is user-editable, so invalid values
 * normalise to defaults; repeated keys take the first value. `unit` scopes
 * the member filter; `member` opens the inspector; `view` picks the surface.
 */
export const parseWorkspaceQuery = (
  searchParams: SearchParams
): WorkspaceQuery => {
  const accepted: Record<string, string> = {};
  for (const key of filterKeys) {
    const value = firstOf(searchParams, key);
    if (value === undefined || value === "") {
      continue;
    }
    if (memberFilterSchema.shape[key].safeParse(value).success) {
      accepted[key] = value;
    }
  }
  const unit = firstOf(searchParams, "unit");
  if (unit && memberFilterSchema.shape.unitId.safeParse(unit).success) {
    accepted.unitId = unit;
  }
  const rawView = firstOf(searchParams, "view");
  const rawMember = firstOf(searchParams, "member");
  const member = memberIdSchema.safeParse(rawMember);
  return {
    filter: memberFilterSchema.parse(accepted),
    memberId: member.success ? member.data : undefined,
    view: isView(rawView) ? rawView : "people",
  };
};

export interface WorkspaceLink {
  filter: Partial<MemberFilter>;
  memberId?: string;
  view?: WorkspaceView;
}

/** Workspace state → URL query, omitting defaults so links stay short. */
export const workspaceQueryString = (link: WorkspaceLink): string => {
  const params = new URLSearchParams();
  if (link.view && link.view !== "people") {
    params.set("view", link.view);
  }
  if (link.filter.unitId) {
    params.set("unit", link.filter.unitId);
  }
  if (link.filter.query) {
    params.set("query", link.filter.query);
  }
  if (link.filter.role) {
    params.set("role", link.filter.role);
  }
  if (link.filter.status) {
    params.set("status", link.filter.status);
  }
  if (link.filter.page && link.filter.page > 1) {
    params.set("page", String(link.filter.page));
  }
  if (link.filter.pageSize && link.filter.pageSize !== 25) {
    params.set("pageSize", String(link.filter.pageSize));
  }
  if (link.memberId) {
    params.set("member", link.memberId);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
};

export const workspacePath = (orgSlug: string) => `/${orgSlug}/organization`;
