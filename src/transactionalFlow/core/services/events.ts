import z from "zod";

export const stage1EventSchema = z.object({
  id: z.string().uuid(),
  value: z.number(),
});
export type Stage1Event = z.infer<typeof stage1EventSchema>;

export const stage2EventSchema = z.object({
  id: z.string().uuid(),
  squaredValue: z.number().min(0),
});
export type Stage2Event = z.infer<typeof stage2EventSchema>;
