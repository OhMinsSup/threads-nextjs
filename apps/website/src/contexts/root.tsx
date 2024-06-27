import React from "react";
import { SessionProvider } from "next-auth/react";

import { ThemeProvider } from "@thread/ui/theme";

import { TRPCReactProvider } from "~/trpc/react";
import AppProvider from "./app";

interface ProviderProps {
  children: React.ReactNode;
}

export default function RootProvider({ children }: ProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <AppProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </AppProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
