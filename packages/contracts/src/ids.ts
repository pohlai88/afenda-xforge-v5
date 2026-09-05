import { z } from "zod";

// Tenant scope is a type, not a string: an OrganizationId cannot be passed
// where a MemberId is expected, and neither can be built from a raw string
// without going through its schema.
export const organizationIdSchema = z.string().min(1).brand<"OrganizationId">();
export type OrganizationId = z.infer<typeof organizationIdSchema>;

export const organizationSlugSchema = z
  .string()
  .regex(/^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/u)
  .brand<"OrganizationSlug">();
export type OrganizationSlug = z.infer<typeof organizationSlugSchema>;

export const memberIdSchema = z.string().min(1).brand<"MemberId">();
export type MemberId = z.infer<typeof memberIdSchema>;

export const organizationUnitIdSchema = z
  .string()
  .min(1)
  .brand<"OrganizationUnitId">();
export type OrganizationUnitId = z.infer<typeof organizationUnitIdSchema>;
