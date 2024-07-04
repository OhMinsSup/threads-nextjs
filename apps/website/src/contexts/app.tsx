"use client";

import React from "react";

import type { Client } from "@thread/sdk";
import { createClient } from "@thread/sdk";

import { env } from "~/env";
import { ApiClientProvider } from "./api";
import TokenProvider from "./token";

const createApiClient = (options?: Parameters<typeof createClient>[1]) =>
  createClient(env.NEXT_PUBLIC_SERVER_URL, options);

let apiClientSingleton: Client | undefined = undefined;
const getApiClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createApiClient();
  } else {
    // Browser: use singleton pattern to keep the same query client
    return (apiClientSingleton ??= createApiClient());
  }
};

interface Props {
  children: React.ReactNode;
}

export default function AppProvider({ children }: Props) {
  const apiClient = getApiClient();

  return (
    <ApiClientProvider client={apiClient}>
      <TokenProvider>{children}</TokenProvider>
    </ApiClientProvider>
  );
}
