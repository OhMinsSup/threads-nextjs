import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import type { TRPCRouterRecord } from '@trpc/server';

import { commonService } from '~/services/common/common.service';
import { protectedProcedure } from '~/services/trpc/core/trpc';

export const commonRouter = {
  revalidatePath: protectedProcedure
    .input(
      z.object({
        originalPath: z.string(),
        type: z.enum(['layout', 'page']).optional(),
      }),
    )
    .query(({ input }) => {
      revalidatePath(input.originalPath, input.type);
      return {
        revalidated: true,
        now: Date.now(),
      };
    }),
  getReasons: protectedProcedure.query(async () => {
    return await commonService.getReportReasons();
  }),
} satisfies TRPCRouterRecord;
