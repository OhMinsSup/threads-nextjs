import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  getRequireSession: protectedProcedure.query(({ ctx }) => {
    return null;
  }),
  getSession: publicProcedure.query(({ ctx }) => {
    return null;
  }),
} satisfies TRPCRouterRecord;
