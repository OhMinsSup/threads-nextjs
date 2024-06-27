/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextAuthConfig } from "next-auth";
// The `JWT` interface can be found in the `next-auth/jwt` submodule
import type { DefaultJWT, JWT as NextAuthJWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

import type { SigninResponse } from "@thread/sdk";
import type { FormFieldSignInSchema } from "@thread/sdk/schema";
import { HttpResultStatus } from "@thread/enum/result-status";
import { createError, isError } from "@thread/error";
import { createClient } from "@thread/sdk";

import { env } from "../env";

interface Token {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt: number;
}

type User = SigninResponse;

const dateToNumber = (date: Date | number | string) => {
  if (date instanceof Date) {
    return date.getTime();
  }

  if (typeof date === "string") {
    return new Date(date).getTime();
  }

  return date;
};

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
        const client = createClient(env.NEXT_PUBLIC_SERVER_URL);

        try {
          const response = await client.auth
            .rpc("signIn")
            .call(credentials as unknown as FormFieldSignInSchema);

          if (response.error) {
            throw createError({
              message: "Failed to sign in",
              data: response.error,
            });
          }

          const code = response.resultCode.toString();
          if (code === HttpResultStatus.INCORRECT_PASSWORD.toString()) {
            throw createError({
              message: "Incorrect password",
              data: {
                password: {
                  message: response.message,
                },
              },
            });
          }

          if (code === HttpResultStatus.NOT_EXIST.toString()) {
            throw createError({
              message: "User does not exist",
              data: {
                email: {
                  message: response.message,
                },
              },
            });
          }

          return response.result;
        } catch (error) {
          if (isError(error)) {
            throw error;
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      // Listen for `update` event
      if (trigger === "update" && session?.user) {
        const {
          accessToken,
          accessTokenExpiresAt,
          refreshToken,
          refreshTokenExpiresAt,
        } = session.user;
        return {
          ...token,
          accessToken,
          accessTokenExpiresAt,
          refreshToken,
          refreshTokenExpiresAt,
        } as NextAuthJWT | null;
      }

      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        // Save the access token and refresh token in the JWT on the initial login, as well as the user details
        token.accessToken = (user as User).tokens.accessToken.token;
        token.accessTokenExpiresAt = dateToNumber(
          (user as User).tokens.accessToken.expiresAt,
        );
        token.refreshToken = (user as User).tokens.refreshToken.token;
        token.refreshTokenExpiresAt = dateToNumber(
          (user as User).tokens.refreshToken.expiresAt,
        );
        return token;
      } else if (
        token.accessToken &&
        token.accessTokenExpiresAt &&
        Date.now() < token.accessTokenExpiresAt * 1000
      ) {
        // Subsequent logins, if the access token is still valid, return the JWT
        return token as NextAuthJWT | null;
      }
      // Subsequent logins, if the access token has expired, try to refresh it
      if (!token.refreshToken) {
        throw createError({
          message: "Missing refresh token",
        });
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
          refreshToken: token.refreshToken,
        });

        if (response.error) {
          throw createError({
            message: "Failed to refresh access token",
            data: response.error,
          });
        }

        const nextUser: NextAuthJWT = {
          id: token.sub,
          email: token.email,
          name: token.name,
          image: token.picture,
          accessToken: response.result.accessToken.token,
          accessTokenExpiresAt: dateToNumber(
            response.result.accessToken.expiresAt,
          ),
          refreshToken: response.result.refreshToken.token,
          refreshTokenExpiresAt: dateToNumber(
            response.result.refreshToken.expiresAt,
          ),
        };

        return nextUser;
      } catch (error) {
        console.error(error);
        // The error property can be used client-side to handle the refresh token error
        return {
          ...token,
          error: "RefreshAccessTokenError" as const,
        } as NextAuthJWT | null;
      }
    },
    session: ({ session, token }) => {
      session.error = token.error;
      return {
        ...session,
        user: {
          id: token.sub,
          email: token.email,
          name: token.name,
          image: token.picture,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          accessTokenExpiresAt: token.accessTokenExpiresAt,
          refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        },
      };
    },
  },
} satisfies NextAuthConfig;

declare module "next-auth" {
  interface Session {
    user: Pick<User, "email" | "id" | "image" | "name"> & Token;
    error?: "RefreshAccessTokenError";
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT extends DefaultJWT, Token {
    error?: "RefreshAccessTokenError";
  }
}
