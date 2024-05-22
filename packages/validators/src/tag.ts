import * as z from "zod";

export const schema = {
  create: z.object({
    name: z.string().min(1).max(50),
  }),
};

export type FormFieldsCreateSchema = z.infer<typeof schema.create>;
