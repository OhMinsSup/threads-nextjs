import * as z from "zod";

import { schema as $pagination } from "./pagination";

export const schema = {
  default: z
    .object({
      keyword: z.string().optional(),
      searchType: z
        .enum(["default", "tags", "mentions"])
        .default("default")
        .optional(),
      tagId: z.string().optional(),
      userId: z.string().optional(),
    })
    .merge($pagination.pagination),
  keyword: z.object({
    keyword: z.string().optional(),
  }),
};

export type SearchQuerySchema = z.infer<typeof schema.default>;

export type SearchKeywordQuerySchema = z.infer<typeof schema.keyword>;
