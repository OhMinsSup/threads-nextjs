'use client';

import React, { useCallback } from 'react';

import { Icons } from '~/components/icons';
import { type NavItem } from '~/constants/nav';
import { useMainLinkActive } from '~/libs/hooks/useMainLinkActive';
import useNavigateThreanForm from '~/libs/hooks/useNavigateThreanForm';
import { cn } from '~/utils/utils';

interface ButtonThreadProps {
  item: NavItem;
  type: 'footer' | 'header';
}

export default function ButtonThread({ item, type }: ButtonThreadProps) {
  const { isActive, href } = useMainLinkActive({ item });

  const { handleHref, isPending } = useNavigateThreanForm();

  const onClick = useCallback(() => {
    handleHref();
  }, [handleHref]);

  return (
    <button
      type="button"
      role="link"
      data-href={item.disabled ? '#' : href}
      tabIndex={isActive ? 0 : -1}
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
      onClick={onClick}
    >
      {isPending ? (
        <Icons.rotateCcw className="mr-2 size-4 animate-spin" />
      ) : (
        <item.icon />
      )}
    </button>
  );
}
