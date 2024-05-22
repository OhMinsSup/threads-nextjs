import type { TRPCRouterRecord } from "@trpc/server";

import { schema as $search } from "@thread/validators/search";
import { schema as $tag } from "@thread/validators/tag";

import { tagsService } from "../services/tags.services";
import { protectedProcedure } from "../trpc";

export const tagsRouter = {
  create: protectedProcedure
    .input($tag.create)
    .mutation(async ({ input, ctx }) => {
      const exists = await tagsService.byName(input.name);
      if (exists) return exists;
      return await tagsService.create(ctx.session.user.id, input);
    }),
  getMentionTags: protectedProcedure
    .input($search.keyword)
    .query(async ({ input }) => {
      if (!input.keyword) return [];
      return await tagsService.getMentionTags(input.keyword);
    }),
} satisfies TRPCRouterRecord;
