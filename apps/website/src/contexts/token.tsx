"use client";

import React, { useCallback, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

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
  const { data, update } = useSession();
  const client = useApiClient();

  console.log("[TokenProvider] data", data);

  useEffect(() => {
    if (!data) {
      return;
    }

    if (data.error === "RefreshAccessTokenError") {
      console.log("[TokenProvider] RefreshAccessTokenError");
      signOut();
      return;
    }
  }, [data]);

  return <>{children}</>;
}
