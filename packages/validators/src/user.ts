import * as z from "zod";

import { schema as $pagination } from "./pagination";
import { schema as $search } from "./search";

export const schema = {
  update: z.object({
    name: z.string().max(50, "이름은 50글자 이하이어야 합니다."),
    bio: z
      .string()
      .max(100, "자기소개는 100글자 이하이어야 합니다.")
      .optional(),
    website: z.string().url().optional(),
  }),
  list: z.object({}).merge($pagination.pagination).merge($search.keyword),
  id: z.object({
    userId: z.string(),
  }),
};

export type UpdateProfileInputSchema = z.infer<typeof schema.update>;
export type ListInputSchema = z.infer<typeof schema.list>;
export type UserIdInput = z.infer<typeof schema.id>;
