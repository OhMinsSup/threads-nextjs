import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";

import type { User, UserProfile } from "@thread/db";
import { prisma } from "@thread/db";
import {
  getFullExternalUserSelector,
  getInternalUserSelector,
} from "@thread/db/selectors";
import { HttpStatus } from "@thread/enum/http-status";
import { createError } from "@thread/error/http";
import { secureCompare } from "@thread/shared/password";
import { schema } from "@thread/validators/signin";

declare module "next-auth" {
  interface Session {
    user: {
      profile: Pick<UserProfile, "bio" | "website"> | null;
    } & Pick<
      User,
      "id" | "name" | "username" | "email" | "emailVerified" | "image"
    >;
  }
}

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const input = await schema.safeParseAsync(credentials);
        if (!input.success) {
          throw createError({
            message: "잘못된 입력값",
            status: HttpStatus.BAD_REQUEST,
            data: {
              key: input.error.name,
              message: input.error.message,
            },
          });
        }

        const user1 = await prisma.user.findUnique({
          where: {
            username: input.data.username,
          },
          select: getInternalUserSelector(),
        });

        if (!user1) {
          throw createError({
            message: "유저를 찾을 수 없습니다",
            status: HttpStatus.NOT_FOUND,
            data: {
              username: "User not found",
            },
          });
        }

        if (user1.password && user1.salt) {
          const isMatch = await secureCompare(
            input.data.password,
            user1.password,
          );

          if (!isMatch) {
            throw createError({
              message: "비밀번호가 일치하지 않습니다",
              status: HttpStatus.UNAUTHORIZED,
            });
          }
        }

        const user2 = await prisma.user.findUnique({
          where: {
            id: user1.id,
          },
          select: getFullExternalUserSelector({ userId: user1.id }),
        });

        return user2;
      },
      credentials: {
        username: {},
        password: {},
      },
    }),
  ],
  callbacks: {
    session: (opts) => {
      if (!("user" in opts)) throw "unreachable with session strategy";

      console.log("opts ==>", opts);

      return {
        ...opts.session,
        user: {
          ...opts.session.user,
          id: opts.user.id,
        },
      };
    },
  },
} satisfies NextAuthConfig;
