import z from "zod";

const _customerSchema = z.object({
  id: z.string().uuid(),
});

const createdType = z.literal("customer_created");
export const customerCreatedSchema = _customerSchema.and(
  z.object({
    type: createdType,
    firstName: z.string(),
    lastName: z.string(),
  })
);
export type CustomerCreated = z.infer<typeof customerCreatedSchema>;

const updatedType = z.literal("customer_updated");
export const customerUpdatedSchema = _customerSchema.and(
  z.object({
    type: updatedType,
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  })
);
export type CustomerUpdated = z.infer<typeof customerUpdatedSchema>;

const suspendedType = z.literal("customer_suspended");
export const customerSuspendedSchema = _customerSchema.and(
  z.object({
    type: suspendedType,
  })
);
export type CustomerSuspended = z.infer<typeof customerSuspendedSchema>;

const reinstatedType = z.literal("customer_reinstated");
export const customerReinstatedSchema = _customerSchema.and(
  z.object({
    type: reinstatedType,
  })
);
export type CsutomerReinstated = z.infer<typeof customerReinstatedSchema>;

export type CustomerEvent =
  | CustomerCreated
  | CustomerUpdated
  | CustomerSuspended
  | CsutomerReinstated;

export const customerEventTypeSchema = z.union([
  createdType,
  updatedType,
  suspendedType,
  reinstatedType,
]);
export type CustomerEventType = z.infer<typeof customerEventTypeSchema>;
