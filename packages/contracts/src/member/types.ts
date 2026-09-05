import type { z } from "zod";
import type {
  inviteMemberInputSchema,
  memberFilterSchema,
  memberPageSchema,
  memberRoleSchema,
  memberSchema,
  memberStatusSchema,
  updateMemberRoleInputSchema,
} from "./schema";

export type Member = z.infer<typeof memberSchema>;
export type MemberRole = z.infer<typeof memberRoleSchema>;
export type MemberStatus = z.infer<typeof memberStatusSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberInputSchema>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleInputSchema>;
/** Parsed filter — page and pageSize are always present after parsing. */
export type MemberFilter = z.infer<typeof memberFilterSchema>;
export type MemberPage = z.infer<typeof memberPageSchema>;
