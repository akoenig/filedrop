import { z } from "zod";

/**
 * Schema for parsing migration row results.
 */
export const MigrationRowSchema = z.object({
  name: z.string(),
});