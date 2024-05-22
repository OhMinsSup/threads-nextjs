'use client';

import { ThemeProvider } from 'next-themes';

import { Toaster } from '~/components/ui/toaster';
import { TRPCReactProvider } from '~/services/trpc/react';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <TRPCReactProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </TRPCReactProvider>
  );
}
