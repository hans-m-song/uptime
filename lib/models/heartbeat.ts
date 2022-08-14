import { z } from "zod";

export const heartbeatKeySchema = z.object({
  day: z.number(),
  minute: z.number(),
});

export type IHeartbeatKey = z.infer<typeof heartbeatKeySchema>;

export const heartbeatSchema = heartbeatKeySchema.and(
  z.object({ targets: z.record(z.number()) })
);

export type IHeartbeat = z.infer<typeof heartbeatSchema>;
