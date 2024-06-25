/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextAuthConfig } from "next-auth";
// The `JWT` interface can be found in the `next-auth/jwt` submodule
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

import type { SigninResponse } from "@thread/sdk";
import { HttpStatus } from "@thread/enum/http-status";
import { createError } from "@thread/error/http";
import { createClient } from "@thread/sdk";
import { authSchema } from "@thread/sdk/schema";

import { env } from "../env";

type User = SigninResponse["user"] & SigninResponse["tokens"];

export const authConfig = {
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
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

        const client = createClient(env.NEXT_PUBLIC_SERVER_URL);

        try {
          const response = await client.auth.rpc("signIn").call(input.data);
          if (response.error) {
            return null;
          }

          const { user, tokens } = response.result;

          const nextUser = {
            ...user,
            ...tokens,
          };

          return nextUser;
        } catch (error) {
          console.log("asdsa");
          console.error(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      console.log({
        token,
        user,
        trigger,
        session,
      });

      // Listen for `update` event
      if (trigger === "update" && session?.user) {
        const { id, accessToken, refreshToken } = session.user;

        return {
          ...token,
          user: {
            ...(token.user ?? {}),
            id,
            accessToken,
            refreshToken,
          },
        } as JWT | null;
      }

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (user) {
        // Save the access token and refresh token in the JWT on the initial login, as well as the user details
        token.user = user as User;
        return token;
      } else if (
        token.user &&
        Date.now() <
          (token.user.accessToken.expiresAt as unknown as number) * 1000
      ) {
        // Subsequent logins, if the access token is still valid, return the JWT
        return token as JWT | null;
      }
      // Subsequent logins, if the access token has expired, try to refresh it
      if (!token.user?.refreshToken) {
        const error = new Error();
        error.name = "RefreshAccessTokenError";
        error.message = "Missing refresh token";
        throw error;
      }

      const client = createClient(env.NEXT_PUBLIC_SERVER_URL);

      try {
        /**
         * ! Can not use axios here, this cause error
         * * Fetch promises only reject with a TypeError when a network error occurs.
         * * Since 4xx and 5xx responses aren't network errors, there's nothing to catch.
         * * You'll need to throw an error yourself to use Promise#catch
         */
        const response = await client.auth.rpc("refresh").call({
          refreshToken: token.user.refreshToken.token,
        });

        if (response.error) {
          const error = new Error();
          error.name = "RefreshAccessTokenError";
          error.message = "Failed to refresh access token";
          throw error;
        }

        const { accessToken, refreshToken } = response.result;

        const nextUser = {
          ...token.user,
          accessToken,
          refreshToken,
        };

        return nextUser;
      } catch (error) {
        // The error property can be used client-side to handle the refresh token error
        return {
          ...token,
          error: "RefreshAccessTokenError" as const,
        } as JWT | null;
      }
    },
    session: ({ session, token }) => {
      session.error = token.error;
      return {
        ...session,
        ...token,
      };
    },
  },
} satisfies NextAuthConfig;

declare module "next-auth" {
  interface Session {
    user: User;
    error?: "RefreshAccessTokenError";
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    user?: User;
    error?: "RefreshAccessTokenError";
  }
}
