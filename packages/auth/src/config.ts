import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import type { User } from "./servcies/types";
import { authService } from "./servcies/auth";

export const authConfig = {
  pages: {
    signIn: "/signin",
  },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        return await authService.authorize(credentials);
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, ...other }) => {
      return await authService.jwt({
        token,
        user: user as unknown as User,
        trigger,
        ...other,
      });
    },
    session: ({ session, token }) => {
      console.log("[JWT] session - session", session);
      console.log("[JWT] session - token", token);
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
