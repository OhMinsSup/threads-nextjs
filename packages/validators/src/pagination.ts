import * as z from "zod";

export const schema = {
  pagination: z.object({
    limit: z.number().optional().default(30),
    pageNo: z.number().optional().default(1),
  }),
};

export type PaginationQuerySchema = z.infer<typeof schema.pagination>;
