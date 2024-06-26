'server-only';

import * as z from 'zod';

export const cursorPaginationQuerySchema = z.object({
  limit: z.number().optional().default(30),
  cursor: z.string().optional(),
});

export const searchQuerySchema = z.object({
  keyword: z.string().optional(),
});

export const listQuerySchema = z
  .object(searchQuerySchema.shape)
  .merge(cursorPaginationQuerySchema)
  .optional();

export type UserListQuerySchema = z.infer<typeof listQuerySchema>;

export const userFollowListQuerySchema = z
  .object({
    userId: z.string(),
  })
  .merge(cursorPaginationQuerySchema);

export type UserFollowListQuerySchema = z.infer<
  typeof userFollowListQuerySchema
>;
