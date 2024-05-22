import React from 'react';

import FloatingLink from '~/components/layout/floating-link';
import MainTabs from '~/components/layout/main-tabs';
import PageLoading from '~/components/layout/page-loading';
import ClientOnly from '~/components/shared/client-only';
import ThreadsInput from '~/components/write/threads-input';
import { api } from '~/services/trpc/server';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const session = await api.auth.getRequireSession();
  return (
    <ClientOnly fallback={<PageLoading />}>
      <MainTabs>
        <ThreadsInput session={session} />
        {children}
        <FloatingLink />
      </MainTabs>
    </ClientOnly>
  );
}
