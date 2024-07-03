import type { TRPCRouterRecord } from "@trpc/server";

// import { schema } from "@thread/validators/search";

import { protectedProcedure } from "../trpc";

export const searchRouter = {
  getSearch: protectedProcedure
    // .input(schema.default)
    .query(async ({ input, ctx }) => {
      // switch (input.searchType) {
      //   case "tags": {
      //     return await searchService.getSearchThreads(
      //       ctx.session.user.id,
      //       input,
      //     );
      //   }
      //   default: {
      //     return await searchService.getSearchUsers(ctx.session.user.id, input);
      //   }
      // }
    }),
  getSearchDialogUsers: protectedProcedure
    // .input(schema.keyword)
    .query(async ({ input, ctx }) => {
      // await searchService.getSearchDialogUsers(ctx.session.user.id, input)
    }),
} satisfies TRPCRouterRecord;
