import { z } from "zod";
import {
  memberIdSchema,
  organizationIdSchema,
  organizationUnitIdSchema,
} from "../ids";

export const memberRoleSchema = z.enum(["owner", "admin", "member"]);
export const memberStatusSchema = z.enum(["active", "invited"]);

// `title` and `unitId` are nullable, not optional: an unassigned member is a
// visible fact the workspace surfaces, never an absent key.
export const memberSchema = z.object({
  email: z.email().max(254),
  id: memberIdSchema,
  joinedAt: z.iso.datetime(),
  name: z.string().trim().min(1).max(80),
  organizationId: organizationIdSchema,
  role: memberRoleSchema,
  status: memberStatusSchema,
  title: z.string().trim().min(1).max(80).nullable(),
  unitId: organizationUnitIdSchema.nullable(),
});

export const inviteMemberInputSchema = z.object({
  email: z.email().max(254),
  name: z.string().trim().min(1).max(80),
  role: memberRoleSchema,
});

export const updateMemberRoleInputSchema = z.object({
  role: memberRoleSchema,
});

/** What the edit surface may change; role keeps its own invariant-guarded op. */
export const updateMemberInputSchema = z.object({
  name: z.string().trim().min(1).max(80),
  title: z.string().trim().min(1).max(80).nullable(),
  unitId: organizationUnitIdSchema.nullable(),
});

export const moveMembersInputSchema = z.object({
  memberIds: z.array(memberIdSchema).min(1).max(100),
  unitId: organizationUnitIdSchema,
});

export const memberFilterSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(10).max(100).default(25),
  query: z.string().trim().max(100).optional(),
  role: memberRoleSchema.optional(),
  status: memberStatusSchema.optional(),
  /** Scopes to the unit AND its descendants — the tree is a scope, not a filter chip. */
  unitId: organizationUnitIdSchema.optional(),
});

export const memberPageSchema = z.object({
  items: z.array(memberSchema),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
});
