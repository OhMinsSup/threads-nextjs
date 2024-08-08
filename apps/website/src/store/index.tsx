import React from "react";
import { SessionProvider } from "next-auth/react";

import { ThemeProvider } from "@thread/ui/theme";

import { auth } from "~/auth";
import { TRPCReactProvider } from "~/store/trpc/react";
import { TokenProvider } from "./token";

interface ProviderProps {
  children: React.ReactNode;
}

export async function Provider({ children }: ProviderProps) {
  const session = await auth();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider session={session}>
        <TokenProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </TokenProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
