'use client';

import React from 'react';
import Link from 'next/link';

import { type NavItem } from '~/constants/nav';
import { useMainLinkActive } from '~/libs/hooks/useMainLinkActive';
import { cn } from '~/utils/utils';

interface ButtonLinkProps {
  item: NavItem;
  type: 'footer' | 'header';
}

export default function ButtonLink({ item, type }: ButtonLinkProps) {
  const { isActive, href } = useMainLinkActive({ item });

  return (
    <Link
      href={item.disabled ? '#' : href}
      scroll={item.id !== 'thread'}
      replace={item.id === 'thread'}
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
