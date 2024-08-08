import type { Client } from "@thread/sdk";
import { createClient } from "@thread/sdk";

import { env } from "~/env";

export const createApiClient = (options?: Parameters<typeof createClient>[1]) =>
  createClient(env.NEXT_PUBLIC_SERVER_URL, options);

let apiClientSingleton: Client | undefined = undefined;
export const getApiClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createApiClient();
  } else {
    // Browser: use singleton pattern to keep the same query client
    return (apiClientSingleton ??= createApiClient());
  }
};
