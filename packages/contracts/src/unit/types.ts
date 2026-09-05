import type { z } from "zod";
import type {
  organizationUnitSchema,
  organizationUnitTypeSchema,
  organizationUnitWithCountSchema,
} from "./schema";

export type OrganizationUnit = z.infer<typeof organizationUnitSchema>;
export type OrganizationUnitType = z.infer<typeof organizationUnitTypeSchema>;
export type OrganizationUnitWithCount = z.infer<
  typeof organizationUnitWithCountSchema
>;
