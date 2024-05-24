import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";

// import GitHub from "next-auth/providers/github";

import type { User, UserProfile } from "@thread/db";
import { prisma, Prisma } from "@thread/db";
import { getFullExternalUserSelector } from "@thread/db/selectors";
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
  adapter: PrismaAdapter(Prisma),
  providers: [
    // GitHub({
    //   clientId: env.GITHUB_CLIENT_ID,
    //   clientSecret: env.GITHUB_CLIENT_SECRET,
    //   profile(profile) {
    //     return {
    //       id: profile.id.toString(),
    //       name: profile.name ?? profile.login,
    //       email: profile.email,
    //       image: profile.avatar_url,
    //     };
    //   },
    // }),
    Credentials({
      id: "credentials",
      name: "Credentials",
      async authorize(credentials) {
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
          select: {
            id: true,
            username: true,
            password: true,
            salt: true,
          },
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
        username: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
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
