import { z } from "zod";
import { organizationIdSchema, organizationSlugSchema } from "../ids";

export const organizationSchema = z.object({
  createdAt: z.iso.datetime(),
  id: organizationIdSchema,
  name: z.string().trim().min(1).max(120),
  slug: organizationSlugSchema,
});
