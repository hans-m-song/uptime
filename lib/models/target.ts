import { z } from "zod";

export const TargetKeySchema = z.object({ url: z.string() });

export const TargetSchema = TargetKeySchema.and(z.object({ name: z.string() }));

export type ITarget = z.infer<typeof TargetSchema>;
