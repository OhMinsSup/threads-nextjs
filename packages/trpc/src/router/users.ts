import type { TRPCRouterRecord } from "@trpc/server";

import { schema as $search } from "@thread/validators/search";

import { usersService } from "../services/users.services";
import { protectedProcedure } from "../trpc";

export const usersRouter = {
  getSimpleUsers: protectedProcedure
    .input($search.keyword)
    .query(async ({ input }) => {
      if (!input.keyword) return [];
      return await usersService.getSimpleUsers(input.keyword);
    }),
} satisfies TRPCRouterRecord;
