import type { TRPCRouterRecord } from "@trpc/server";

import { reasonService } from "../services/reason.service";
import { protectedProcedure } from "../trpc";

export const commonRouter = {
  reasons: protectedProcedure.query(() => reasonService.list()),
} satisfies TRPCRouterRecord;
