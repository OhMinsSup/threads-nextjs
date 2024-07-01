import type { JWT as NextAuthJWT } from "next-auth/jwt";

import type { FormFieldSignInSchema } from "@thread/sdk/schema";
import { HttpStatus } from "@thread/enum/http-status";
import { HttpResultStatus } from "@thread/enum/result-status";
import { createError, isError } from "@thread/error";
import { isError as isHttpError } from "@thread/error/http";
import { createClient, FetchError } from "@thread/sdk";

import type { JWTParams, SessionParams, User } from "./types";
import { env } from "../../env";

class AuthService {
  private _BUFFER_TIME = 5 * 60;

  private _isDebug = false;

  private _client = createClient(env.NEXT_PUBLIC_SERVER_URL);

  private _safeToDate = (date: Date | number | string) => {
    if (date instanceof Date) {
      return date.getTime();
    }

    if (typeof date === "string") {
      return new Date(date).getTime();
    }

    return date;
  };

  // 로그인
  authorize = async (credentials: unknown) => {
    const unsafeInput = credentials as FormFieldSignInSchema;
    const response = await this._client.auth.rpc("signIn").call(unsafeInput);

    if (response.resultCode !== HttpResultStatus.OK) {
      throw createError({
        message: "Failed to sign in",
        data: response.message,
      });
    }

    return response.result;
  };

  // jwt
  jwt = async ({ token, user, trigger, session }: JWTParams) => {
    if (this._isDebug) {
      console.log("[JWT] jwt - token", token);
      console.log("[JWT] jwt - user", user);
      console.log("[JWT] jwt - trigger", trigger);
      console.log("[JWT] jwt - session", session);
    }

    // Listen for `update` event
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (trigger === "update" && session?.user) {
      const { user } = session as { user: User };
      return {
        ...token,
        sub: user.id,
        email: user.email,
        name: user.name,
        picture: user.image,
        accessToken: user.tokens.accessToken.token,
        refreshToken: user.tokens.refreshToken.token,
        accessTokenExpiresAt: this._safeToDate(
          user.tokens.accessToken.expiresAt,
        ),
        refreshTokenExpiresAt: this._safeToDate(
          user.tokens.refreshToken.expiresAt,
        ),
      } as NextAuthJWT | null;
    }

    if (user) {
      const { refreshToken, accessToken } = user.tokens;

      Object.assign(token, {
        sub: user.id,
        email: user.email,
        name: user.name,
        picture: user.image,
        accessToken: accessToken.token,
        refreshToken: refreshToken.token,
        accessTokenExpiresAt: this._safeToDate(accessToken.expiresAt),
        refreshTokenExpiresAt: this._safeToDate(refreshToken.expiresAt),
      });

      if (this._isDebug) {
        console.log("[JWT] token - login", token);
      }
      return token;
    } else if (
      token.accessToken &&
      token.accessTokenExpiresAt &&
      // Check if the access token is not expired
      token.accessTokenExpiresAt - this._BUFFER_TIME * 1000 > Date.now()
    ) {
      if (this._isDebug) {
        // The access token not expired
        console.log("[JWT] token - valid", token);
      }
      // Subsequent logins, if the access token is still valid, return the JWT
      return token as NextAuthJWT | null;
    }

    try {
      if (this._isDebug) {
        console.log("[JWT] token - invalid", token);
      }
      // Subsequent logins, if the access token has expired, try to refresh it
      if (!token.refreshToken) {
        if (this._isDebug) {
          console.log("[JWT] token - missing refresh token", token);
        }
        throw createError({
          message: "MissingRefreshToken",
        });
      }

      const client = createClient(env.NEXT_PUBLIC_SERVER_URL);

      const response = await client.auth.rpc("refresh").call({
        refreshToken: token.refreshToken,
      });

      if (this._isDebug) {
        console.log("[JWT] token - refresh", response);
      }

      if (response.error) {
        throw createError({
          message: "InvalidRefreshToken",
          data: response.error,
        });
      }

      const {
        tokens: { accessToken, refreshToken },
        ...other
      } = response.result;

      const nextUser: NextAuthJWT = {
        id: other.id,
        email: other.email,
        name: other.name,
        image: other.image,
        accessToken: accessToken.token,
        refreshToken: refreshToken.token,
        accessTokenExpiresAt: this._safeToDate(accessToken.expiresAt),
        refreshTokenExpiresAt: this._safeToDate(refreshToken.expiresAt),
      };

      return nextUser;
    } catch (error) {
      if (this._isDebug) {
        console.log("[JWT] token - error", error);
        console.log("[JWT] token - error isHttpError", isHttpError(error));
        console.log("[JWT] token - error isError", isError(error));
      }
      // console.error(error);
      if (isHttpError(error) || error instanceof FetchError) {
        switch (error.statusCode) {
          case HttpStatus.UNAUTHORIZED: {
            // The refresh token is invalid
            return Object.assign({}, token, {
              error: "RefreshAccessTokenError",
            }) as NextAuthJWT | null;
          }
          case HttpStatus.NOT_FOUND: {
            // The refresh token is missing
            return Object.assign({}, token, {
              error: "MissingRefreshToken",
            }) as NextAuthJWT | null;
          }
          case HttpStatus.BAD_REQUEST: {
            // The refresh token is invalid
            return Object.assign({}, token, {
              error: "InvalidRefreshToken",
            }) as NextAuthJWT | null;
          }
          default: {
            console.error(error);
            return token as NextAuthJWT | null;
          }
        }
      }

      if (isError(error)) {
        return {
          ...token,
          error: error.message,
        } as NextAuthJWT | null;
      }
      // The error property can be used client-side to handle the refresh token error
      return token as NextAuthJWT | null;
    }
  };

  session = ({ session, token }: SessionParams) => {
    if (this._isDebug) {
      console.log("[JWT] session - session", session);
      console.log("[JWT] session - token", token);
    }
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
  };
}

export const authService = new AuthService();
