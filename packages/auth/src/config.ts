import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";

// import GitHub from "next-auth/providers/github";

import type { User, UserProfile } from "@thread/db";
import { prisma, Prisma } from "@thread/db";
import { getFullExternalUserSelector } from "@thread/db/selectors";
import { HttpStatus } from "@thread/enum/http-status";
import { createError } from "@thread/error/http";
import { schema } from "@thread/validators/signin";

import { secureCompare } from "./password";

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
            message: "Invalid credentials",
            status: HttpStatus.BAD_REQUEST,
            data: input.error,
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
            message: "User not found",
            status: HttpStatus.NOT_FOUND,
          });
        }

        if (user1.password && user1.salt) {
          const isMatch = await secureCompare(
            input.data.password,
            user1.password,
          );

          if (!isMatch) {
            throw createError({
              message: "Invalid password",
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
