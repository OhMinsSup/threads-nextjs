import { TRPCRouterRecord } from "@trpc/server";

import {
  followUserSchema,
  updateProfileSchema,
  userIdSchema,
} from "~/services/users/users.input";
import {
  searchQuerySchema,
  userFollowListQuerySchema,
} from "~/services/users/users.query";
import { userService } from "~/services/users/users.service";
import { protectedProcedure } from "../trpc";

export const usersRouter = {
  follow: protectedProcedure
    .input(followUserSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      return await userService.follow(userId, input.targetId);
    }),
  unfollow: protectedProcedure
    .input(followUserSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      return await userService.unfollow(userId, input.targetId);
    }),
  byId: protectedProcedure.input(userIdSchema).query(async ({ input, ctx }) => {
    try {
      const sessionUserId = ctx.session.user.id;
      return await userService.byId(input.userId, sessionUserId);
    } catch (error) {
      console.log("error", error);
      return null;
    }
  }),
  update: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = ctx.session.user.id;
        return await userService.update(userId, input);
      } catch (error) {
        console.log("error", error);
        return null;
      }
    }),
  getMentionUsers: protectedProcedure
    .input(searchQuerySchema)
    .query(async ({ input, ctx }) => {
      try {
        if (!input.keyword) {
          return [];
        }

        const userId = ctx.session.user.id;

        return await userService.getMentionUsers(input.keyword, userId);
      } catch (error) {
        console.log("error", error);
        return [];
      }
    }),
  getFollowers: protectedProcedure
    .input(userFollowListQuerySchema)
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      try {
        const [totalCount, list] = await Promise.all([
          userService.followersCount(userId, input),
          userService.getFollowers(userId, input),
        ]);

        const endCursor = list.at(-1)?.id ?? null;
        const hasNextPage = endCursor
          ? (await userService.hasNextFollowserPage(userId, endCursor, input)) >
            0
          : false;

        return {
          totalCount,
          list,
          endCursor,
          hasNextPage,
        };
      } catch (error) {
        console.log("error", error);
        return {
          totalCount: 0,
          list: [],
          endCursor: null,
          hasNextPage: false,
        };
      }
    }),
  getFollowing: protectedProcedure
    .input(userFollowListQuerySchema)
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      try {
        const [totalCount, list] = await Promise.all([
          userService.followingCount(userId, input),
          userService.getFollowing(userId, input),
        ]);

        const endCursor = list.at(-1)?.id ?? null;
        const hasNextPage = endCursor
          ? (await userService.hasNextFollowingPage(userId, endCursor, input)) >
            0
          : false;

        return {
          totalCount,
          list,
          endCursor,
          hasNextPage,
        };
      } catch (error) {
        console.log("error", error);
        return {
          totalCount: 0,
          list: [],
          endCursor: null,
          hasNextPage: false,
        };
      }
    }),
} satisfies TRPCRouterRecord;
