import type { Account, Profile, Session } from "next-auth";
import type { DefaultJWT, JWT as NextAuthJWT } from "next-auth/jwt";

import type { AuthResponse } from "@thread/sdk";

export interface Token {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt: number;
}

export type User = AuthResponse;

export type TokenErrorType =
  | "RefreshAccessTokenError"
  | "MissingRefreshToken"
  | "InvalidRefreshToken";

declare module "next-auth" {
  interface Session {
    user: Pick<User, "email" | "id" | "image" | "name"> & Token;
    error?: TokenErrorType;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT extends DefaultJWT, Token {
    error?: TokenErrorType;
  }
}

export interface JWTParams {
  /**
   * When `trigger` is `"signIn"` or `"signUp"`, it will be a subset of {@link JWT},
   * `name`, `email` and `image` will be included.
   *
   * Otherwise, it will be the full {@link JWT} for subsequent calls.
   */
  token: NextAuthJWT;
  /**
   * Either the result of the {@link OAuthConfig.profile} or the {@link CredentialsConfig.authorize} callback.
   * @note available when `trigger` is `"signIn"` or `"signUp"`.
   *
   * Resources:
   * - [Credentials Provider](https://authjs.dev/getting-started/authentication/credentials)
   * - [User database model](https://authjs.dev/guides/creating-a-database-adapter#user-management)
   */
  user?: User;
  /**
   * Contains information about the provider that was used to sign in.
   * Also includes {@link TokenSet}
   * @note available when `trigger` is `"signIn"` or `"signUp"`
   */
  account: Account | null;
  /**
   * The OAuth profile returned from your provider.
   * (In case of OIDC it will be the decoded ID Token or /userinfo response)
   * @note available when `trigger` is `"signIn"`.
   */
  profile?: Profile;
  /**
   * Check why was the jwt callback invoked. Possible reasons are:
   * - user sign-in: First time the callback is invoked, `user`, `profile` and `account` will be present.
   * - user sign-up: a user is created for the first time in the database (when {@link AuthConfig.session}.strategy is set to `"database"`)
   * - update event: Triggered by the `useSession().update` method.
   * In case of the latter, `trigger` will be `undefined`.
   */
  trigger?: "signIn" | "signUp" | "update";
  /** @deprecated use `trigger === "signUp"` instead */
  isNewUser?: boolean;
  /**
   * When using {@link AuthConfig.session} `strategy: "jwt"`, this is the data
   * sent from the client via the `useSession().update` method.
   *
   * ⚠ Note, you should validate this data before using it.
   */
  session?: any;
}

export interface SessionParams {
  session: Session;
  /** Available when {@link AuthConfig.session} is set to `strategy: "jwt"` */
  token: NextAuthJWT;
}
