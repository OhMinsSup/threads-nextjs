import type { NextAuthConfig, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import type { SigninResponse } from "@thread/sdk";
import { HttpStatus } from "@thread/enum/http-status";
import { createError } from "@thread/error/http";
import { createClient } from "@thread/sdk";
import { authSchema } from "@thread/sdk/schema";

declare module "next-auth" {
  interface Session {
    user: SigninResponse["user"] & {
      refreshToken: SigninResponse["refreshToken"];
      accessToken: SigninResponse["accessToken"];
    };
  }
}

const client = createClient("http://localhost:8080");

export const authConfig = {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const input = await authSchema.signIn.safeParseAsync(credentials);
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

        try {
          const response = await client.auth.rpc("signIn").call(input.data);
          if (response.error) {
            return null;
          }

          const { user, refreshToken, accessToken } = response.result;

          const nextUser = {
            ...user,
            refreshToken,
            accessToken,
          };

          return nextUser;
        } catch (error) {
          return null;
        }
      },
      credentials: {
        username: {},
        password: {},
      },
    }),
  ],
  callbacks: {
    // session: (opts) => {
    //   if (!("user" in opts)) throw "unreachable with session strategy";
    //   console.log("opts ==>", opts);
    //   return {
    //     ...opts.session,
    //     user: {
    //       ...opts.session.user,
    //       id: opts.user.id,
    //     },
    //   };
    // },
  },
} satisfies NextAuthConfig;
