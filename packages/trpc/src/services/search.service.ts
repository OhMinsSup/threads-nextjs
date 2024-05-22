import { remember } from "@epic-web/remember";

import { prisma } from "@thread/db";
import {
  getFullExternalUserSelector,
  getFullThreadsSelector,
} from "@thread/db/selectors";
import {
  type SearchKeywordQuerySchema,
  type SearchQuerySchema,
} from "@thread/validators/search";

export class SearchService {
  /**
   * @description 대화 검색시 나오는 목록 조회
   * @param {string} userId - 유저 아이디
   * @param {SearchKeywordQuerySchema} input - 조회 조건
   */
  getSearchDialogUsers(userId: string, input: SearchKeywordQuerySchema) {
    return prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
        ...(input &&
          input.keyword && {
            username: {
              contains: input.keyword,
            },
          }),
      },
      orderBy: {
        createdAt: "desc",
      },
      select: getFullExternalUserSelector({
        userId: undefined,
      }),
    });
  }

  /**
   * @description 유저 검색시 나오는 목록 조회
   * @param {string} userId - 유저 아이디
   * @param {SearchQuerySchema} input - 조회 조건
   */
  async getSearchUsers(userId: string, input: SearchQuerySchema) {
    const [totalCount, list] = await Promise.all([
      prisma.user.count({
        where: {
          id: {
            not: userId,
          },
          username: {
            contains: input?.keyword,
          },
          ...(input?.searchType === "mentions" &&
            input.userId && {
              threadMention: {
                some: {
                  userId: input.userId,
                },
              },
            }),
        },
      }),
      prisma.user.findMany({
        where: {
          id: {
            not: userId,
          },
          username: {
            contains: input?.keyword,
          },
          ...(input?.searchType === "mentions" &&
            input.userId && {
              threadMention: {
                some: {
                  userId: input.userId,
                },
              },
            }),
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (input.pageNo - 1) * input.limit,
        take: input.limit,
        select: getFullExternalUserSelector({
          userId: undefined,
        }),
      }),
    ]);

    const hasNextPage = totalCount > input.pageNo * input.limit;

    return {
      type: "users" as const,
      totalCount,
      list,
      hasNextPage,
      currentPage: input.pageNo,
      nextPage: hasNextPage ? input.pageNo + 1 : null,
    };
  }

  /**
   * @description 스레드 검색시 나오는 목록 조회
   * @param {string} _ - 유저 아이디
   * @param {SearchQuerySchema} input - 조회 조건
   */
  async getSearchThreads(_: string, input: SearchQuerySchema) {
    const [totalCount, list] = await Promise.all([
      prisma.thread.count({
        where: {
          ...(input?.searchType === "tags" &&
            input.tagId && {
              tags: {
                some: {
                  tagId: input.tagId,
                },
              },
              text: {
                contains: input.keyword,
              },
            }),
        },
      }),
      prisma.thread.findMany({
        where: {
          ...(input?.searchType === "tags" &&
            input.tagId && {
              tags: {
                some: {
                  tagId: input.tagId,
                },
              },
              text: {
                contains: input.keyword,
              },
            }),
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (input.pageNo - 1) * input.limit,
        take: input.limit,
        select: getFullThreadsSelector({
          userId: undefined,
        }),
      }),
    ]);

    const hasNextPage = totalCount > input.pageNo * input.limit;

    return {
      type: "threads" as const,
      totalCount,
      list,
      hasNextPage,
      currentPage: input.pageNo,
      nextPage: hasNextPage ? input.pageNo + 1 : null,
    };
  }
}

export const searchService =
  process.env.NODE_ENV === "development"
    ? new SearchService()
    : remember("searchService", () => new SearchService());
