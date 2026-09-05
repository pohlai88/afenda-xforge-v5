import type { z } from "zod";
import type { organizationSchema } from "./schema";

export type Organization = z.infer<typeof organizationSchema>;
