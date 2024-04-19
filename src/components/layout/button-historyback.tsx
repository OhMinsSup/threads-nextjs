'use client';

import React, { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { type NavItem } from '~/constants/nav';
import { cn } from '~/utils/utils';

interface ButtonHistoryBackProps {
  item: NavItem;
  type: 'footer' | 'header';
}

export default function ButtonHistoryBack({
  item,
  type,
}: ButtonHistoryBackProps) {
  const pathname = usePathname();
  const router = useRouter();

  const onHistoryBack = useCallback(() => {
    router.back();
  }, [router]);

  // regex 예시) /${영어 숫자 조합}/profile Or /${영어 숫자 조합}/profile
  const regex = new RegExp(`^/\\w+/profile$`);
  if (!regex.test(pathname)) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onHistoryBack}
      className={cn(
        type === 'header'
          ? 'mx-[2px] my-1 flex items-center px-6 py-3 text-lg font-medium transition-colors hover:rounded-md hover:bg-foreground/5 sm:text-sm lg:px-8 lg:py-5'
          : undefined,
        type === 'footer'
          ? 'flex h-10 items-center p-4 text-lg font-medium transition-colors hover:rounded-md hover:bg-foreground/5 sm:text-sm'
          : undefined,
        'text-foreground',
      )}
    >
      <item.icon />
    </button>
  );
}
