import React from 'react';
import { Metadata } from 'next';

import { SITE_CONFIG } from '~/constants/constants';

interface LayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: `검색 • ${SITE_CONFIG.title}`,
  openGraph: {
    title: `검색 • ${SITE_CONFIG.title}`,
  },
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative flex grow flex-col self-center py-4">
      {children}
    </div>
  );
}
