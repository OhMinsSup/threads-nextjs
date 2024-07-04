import { cache } from "react";
import { headers } from "next/headers";

import { auth } from "@thread/auth";
import { createCaller, createTRPCContext } from "@thread/trpc";

import { env } from "~/env";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    session: await auth(),
    headers: heads,
    url: env.NEXT_PUBLIC_SERVER_URL,
  });
});

export const api = createCaller(createContext);
