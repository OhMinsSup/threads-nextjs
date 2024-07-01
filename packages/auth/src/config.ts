import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import type { User } from "./servcies/types";
import { authService } from "./servcies/auth";

export const authConfig = {
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
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
      return authService.session({ session, token });
    },
  },
} satisfies NextAuthConfig;
