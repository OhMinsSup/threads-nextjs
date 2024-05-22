import { remember } from "@epic-web/remember";

import { prisma } from "@thread/db";

export class ReasonService {
  list() {
    return prisma.reportReason.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
  }
}

export const reasonService =
  process.env.NODE_ENV === "development"
    ? new ReasonService()
    : remember("reasonService", () => new ReasonService());
