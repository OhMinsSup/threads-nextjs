import * as z from "zod";

export const schema = {
  create: z.object({
    text: z.string().min(1),
    htmlJSON: z.string().optional(),
    hashTags: z.array(z.string()).optional(),
    mentions: z.array(z.string()).optional(),
  }),
};

export type FormFieldsCreateSchema = z.infer<typeof schema.create>;
