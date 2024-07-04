import React from 'react';
import { Metadata } from 'next';

import { SITE_CONFIG } from '~/constants/constants';

interface LayoutProps {
  children: React.ReactNode;
  params: {
    userId: string;
  };
  comments: React.ReactNode;
  reposts: React.ReactNode;
}

export const metadata: Metadata = {
  title: `스레드 • ${SITE_CONFIG.title}`,
  openGraph: {
    title: `스레드 • ${SITE_CONFIG.title}`,
  },
};

export default function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
