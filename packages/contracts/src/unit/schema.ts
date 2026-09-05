import { z } from "zod";
import { organizationIdSchema, organizationUnitIdSchema } from "../ids";

// The structural vocabulary is supplied by data, not hardcoded around
// "Department": a node's semantics come from its type.
export const organizationUnitTypeSchema = z.enum([
  "legal-entity",
  "business-unit",
  "division",
  "department",
  "team",
]);

export const organizationUnitSchema = z.object({
  id: organizationUnitIdSchema,
  name: z.string().trim().min(1).max(80),
  organizationId: organizationIdSchema,
  parentId: organizationUnitIdSchema.nullable(),
  type: organizationUnitTypeSchema,
});

/**
 * The navigator's read model: the unit plus its DIRECT member count — the
 * adapter derives the number at read time so it can never drift from the
 * members it serves. Screens aggregate subtrees themselves.
 */
export const organizationUnitWithCountSchema = organizationUnitSchema.extend({
  memberCount: z.number().int().min(0),
});
