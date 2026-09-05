import type { MemberFilter } from "@xforge/contracts/member/types";
import {
  type WorkspaceView,
  workspacePath,
  workspaceQueryString,
} from "../filter";

/** The workspace with this filter and view — no inspector open. */
export const workspaceHref = (
  orgSlug: string,
  filter: Partial<MemberFilter>,
  view: WorkspaceView
) => `${workspacePath(orgSlug)}${workspaceQueryString({ filter, view })}`;

/** The same workspace with the inspector open on one member. */
export const inspectorHref = (
  orgSlug: string,
  filter: Partial<MemberFilter>,
  memberId: string
) =>
  `${workspacePath(orgSlug)}${workspaceQueryString({
    filter,
    memberId,
    view: "people",
  })}`;
