"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { signIn, useSession } from "next-auth/react";

import type { Session } from "@thread/auth";
import { HttpResultStatus } from "@thread/enum/result-status";
import { createError } from "@thread/error";

import { TokenScheduler } from "~/utils/token-scheduler/token";
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
  const { data, update } = useSession();
  const client = useApiClient();

  const tokenScheduler = useRef(new TokenScheduler());

  const getTokenScheduler = () => tokenScheduler.current;

  useEffect(() => {
    getTokenScheduler().setSession(data);
  }, [data]);

  // const isRefreshAccessTokenError = useMemo(() => {
  //   if (!data) return false;
  //   if (data.error === "RefreshAccessTokenError") {
  //     return true;
  //   }
  //   return false;
  // }, [data]);

  // const refresh = useCallback(
  //   async (session: Session) => {
  //     try {
  //       console.log("[Refreshing token]");
  //       const response = await client.auth.rpc("refresh").call({
  //         refreshToken: session.user.refreshToken,
  //       });
  //       if (response.error) {
  //         throw createError({
  //           message: "Failed to validate token",
  //           data: response.error,
  //         });
  //       }

  //       if (response.resultCode.toString() !== HttpResultStatus.OK.toString()) {
  //         throw createError({
  //           message: "Failed to refresh access token",
  //           data: response.error,
  //         });
  //       }

  //       const { accessToken, refreshToken } = response.result;
  //       const user = {
  //         accessToken: accessToken.token,
  //         accessTokenExpiresAt: dateToNumber(accessToken.expiresAt),
  //         refreshToken: refreshToken.token,
  //         refreshTokenExpiresAt: dateToNumber(refreshToken.expiresAt),
  //       };
  //       await update({ user });
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         console.log("[Refresh token error, logging out]");

  //         // setTimeout(() => signOut(), 1000);
  //       }
  //     } finally {
  //       if (isFirstMounted) {
  //         setIsFirstMounted(false);
  //       }
  //     }
  //   },
  //   [client, isFirstMounted, update],
  // );

  // // // Auto logout when refresh token expired
  // useEffect(() => {
  //   console.log("[sessionError] frist");
  //   if (isRefreshAccessTokenError) {
  //     console.log("[sessionError]", isRefreshAccessTokenError);
  //     // setTimeout(() => signOut(), 1000);
  //   }
  // }, [data]);

  return <>{children}</>;
}
