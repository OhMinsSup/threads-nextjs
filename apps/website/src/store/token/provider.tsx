"use client";

import React, { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

import { useRafInterval } from "@thread/hooks/useRafInterval";
import { HttpResultStatus } from "@thread/sdk/enum";
import { isSessionExpireDate } from "@thread/utils/date";

import { useApiClient } from "~/store/api";

interface TokenProviderProps {
  children: React.ReactNode;
}

export default function TokenProvider({ children }: TokenProviderProps) {
  const { data, update } = useSession();
  const client = useApiClient();

  const updateSession = async () => {
    console.log("[updateSession] call", data);
    if (!data) {
      return;
    }

    if (data.error) {
      return;
    }

    console.log("[updateSession] data", data);

    const result = isSessionExpireDate(
      data.expires,
      data.user.accessTokenExpiresAt,
    );

    console.log("[updateSession] compareSessionExpireDate", result);

    if (result.isUpdate) {
      try {
        const response = await client.rpc("refresh").patch({
          refreshToken: data.user.refreshToken,
        });
        if (response.resultCode === HttpResultStatus.OK) {
          console.log("[updateSession] update session");
          const session = await update({ user: response.result });
          console.log("[updateSession] update session done", session);
        }
      } catch (error) {
        console.error("[updateSession] error", error);
      }
    } else {
      console.log("[updateSession] not update session");
    }
  };

  useEffect(() => {
    if (!data) {
      return;
    }

    if (
      data.error === "RefreshAccessTokenError" ||
      data.error === "MissingRefreshToken"
    ) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      signOut();
      return;
    }
  }, [data]);

  useRafInterval(
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    () => updateSession(),
    // 1분
    1000 * 60 * 1,
  );

  return <>{children}</>;
}
