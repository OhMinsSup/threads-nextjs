"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { signOut, useSession } from "next-auth/react";

import type { Session } from "@thread/auth";
import { HttpResultStatus } from "@thread/enum/result-status";
import { createError } from "@thread/error";

import { useApiClient } from "./api";

interface TokenProviderProps {
  children: React.ReactNode;
}

const dateToNumber = (date: Date | number | string) => {
  if (date instanceof Date) {
    return date.getTime();
  }

  if (typeof date === "string") {
    return new Date(date).getTime();
  }

  return date;
};

export default function TokenProvider({ children }: TokenProviderProps) {
  const { data: session, update } = useSession();
  const client = useApiClient();

  const [isFirstMounted, setIsFirstMounted] = useState<boolean>(true);

  const sessionError = useMemo(() => {
    if (!session) return false;
    if (session.error === "RefreshAccessTokenError") {
      return true;
    }
    return false;
  }, [session]);

  const refresh = useCallback(
    async (session: Session) => {
      try {
        console.log("[Refreshing token]");
        const response = await client.auth.rpc("refresh").call({
          refreshToken: session.user.refreshToken,
        });
        if (response.error) {
          throw createError({
            message: "Failed to validate token",
            data: response.error,
          });
        }

        if (response.resultCode.toString() !== HttpResultStatus.OK.toString()) {
          throw createError({
            message: "Failed to refresh access token",
            data: response.error,
          });
        }

        const { accessToken, refreshToken } = response.result;
        const user = {
          accessToken: accessToken.token,
          accessTokenExpiresAt: dateToNumber(accessToken.expiresAt),
          refreshToken: refreshToken.token,
          refreshTokenExpiresAt: dateToNumber(refreshToken.expiresAt),
        };
        await update({ user });
      } catch (error) {
        if (error instanceof Error) {
          console.log("[Refresh token error, logging out]");
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          setTimeout(() => signOut(), 1000);
        }
      } finally {
        if (isFirstMounted) {
          setIsFirstMounted(false);
        }
      }
    },
    [client, isFirstMounted, update],
  );

  // Auto logout when refresh token expired
  useEffect(() => {
    console.log("[TokenProvider] sessionError ==>", sessionError);
    if (sessionError) {
      console.log("[Refresh token error, logging out]");
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      setTimeout(() => signOut(), 1000);
    }
  }, [sessionError]);

  // Auto refresh token after interval
  useEffect(() => {
    console.log("[TokenProvider]");
    if (session) {
      // Check if first render
      if (isFirstMounted) {
        console.log("[First render]");
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        refresh(session);
      }

      // Set refresh time shorten than token expired 10% (datetime)
      const expiresAt = session.user.refreshTokenExpiresAt;
      const refreshTime =
        expiresAt -
        Date.now() -
        (expiresAt - session.user.accessTokenExpiresAt) * 0.1;

      console.log("[Setting refresh timer]", refresh);

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      const timer = setInterval(() => refresh(session), refreshTime);

      // Clean up
      return () => clearInterval(timer);
    }
  }, [session, isFirstMounted, update, refresh]);

  return <>{children}</>;
}
