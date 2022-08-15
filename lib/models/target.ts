import { z } from "zod";

export const TargetKeySchema = z.object({ slug: z.string() });

export const PartialTargetSchema = z.object({
  name: z.string(),
  url: z.string(),
  slug: z.string().optional(),
});

export type IPartialTarget = z.infer<typeof PartialTargetSchema>;

export const TargetSchema = PartialTargetSchema.omit({ slug: true }).and(
  TargetKeySchema
);

export type ITarget = z.infer<typeof TargetSchema>;
