"use client";

import React, { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

interface TokenProviderProps {
  children: React.ReactNode;
}

export default function TokenProvider({ children }: TokenProviderProps) {
  const { data, update } = useSession();

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
