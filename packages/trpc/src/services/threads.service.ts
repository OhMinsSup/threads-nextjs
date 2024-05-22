import { remember } from "@epic-web/remember";

import { prisma } from "@thread/db";

export class ThreadsService {}

export const threadsService =
  process.env.NODE_ENV === "development"
    ? new ThreadsService()
    : remember("threadsService", () => new ThreadsService());
