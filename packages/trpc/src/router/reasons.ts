import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure } from "../trpc";

export const reasonsRouter = {
  list: protectedProcedure.query(() => {}),
} satisfies TRPCRouterRecord;
