import React from "react";
import { SessionProvider } from "next-auth/react";

import { auth } from "@thread/auth";
import { ThemeProvider } from "@thread/ui/theme";

import { TRPCReactProvider } from "~/trpc/react";
import AppProvider from "./app";

interface ProviderProps {
  children: React.ReactNode;
}

export default async function RootProvider({ children }: ProviderProps) {
  const session = await auth();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider session={session}>
        <AppProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </AppProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
