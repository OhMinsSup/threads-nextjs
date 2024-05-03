import type { TRPCRouterRecord } from '@trpc/server';

import { protectedProcedure, publicProcedure } from '~/services/trpc/core/trpc';

export const authRouter = {
  getRequireSession: protectedProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
} satisfies TRPCRouterRecord;
