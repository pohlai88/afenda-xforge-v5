import { z } from "zod";
import { memberIdSchema, organizationIdSchema } from "../ids";

export const memberRoleSchema = z.enum(["owner", "admin", "member"]);
export const memberStatusSchema = z.enum(["active", "invited"]);

export const memberSchema = z.object({
  email: z.email().max(254),
  id: memberIdSchema,
  joinedAt: z.iso.datetime(),
  name: z.string().trim().min(1).max(80),
  organizationId: organizationIdSchema,
  role: memberRoleSchema,
  status: memberStatusSchema,
});

export const inviteMemberInputSchema = z.object({
  email: z.email().max(254),
  name: z.string().trim().min(1).max(80),
  role: memberRoleSchema,
});

export const updateMemberRoleInputSchema = z.object({
  role: memberRoleSchema,
});

export const memberFilterSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(10).max(100).default(25),
  query: z.string().trim().max(100).optional(),
  role: memberRoleSchema.optional(),
  status: memberStatusSchema.optional(),
});

export const memberPageSchema = z.object({
  items: z.array(memberSchema),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
});
