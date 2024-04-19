'use client';

import React from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

import { PAGE_ENDPOINTS } from '~/constants/constants';
import { type NavItem } from '~/constants/nav';
import { api } from '~/services/trpc/react';
import { cn } from '~/utils/utils';

interface ButtonMyPageProps {
  item: NavItem;
  type: 'footer' | 'header';
}

export default function ButtonMyPage({ item, type }: ButtonMyPageProps) {
  const segment = useSelectedLayoutSegment();
  const { data } = api.auth.getRequireSession.useQuery();

  const href = data ? PAGE_ENDPOINTS.USER.ID(data.user.id) : '#';

  const isActive = Boolean(segment && href.startsWith(`/${segment}`));

  return (
    <Link
      href={item.disabled ? '#' : href}
      className={cn(
        type === 'header'
          ? 'mx-[2px] my-1 flex items-center px-6 py-3 text-lg font-medium transition-colors hover:rounded-md hover:bg-foreground/5 sm:text-sm lg:px-8 lg:py-5'
          : undefined,
        type === 'footer'
          ? 'flex h-10 items-center p-4 text-lg font-medium transition-colors hover:rounded-md hover:bg-foreground/5 sm:text-sm'
          : undefined,
        isActive ? 'text-foreground' : 'text-foreground/60',
        item.disabled && 'cursor-not-allowed opacity-80',
      )}
    >
      <item.icon />
    </Link>
  );
}
