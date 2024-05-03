'use client';

import React, { useCallback, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useCustomSearchParams } from '~/libs/hooks/useCustomSearchParams';

interface ProfileTabsListProps {
  threads: React.ReactNode;
  comments: React.ReactNode;
  reposts: React.ReactNode;
}

export default function ProfileTabsList({
  threads,
  comments,
  reposts,
}: ProfileTabsListProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { createQueryString } = useCustomSearchParams();
  const [, startTransition] = useTransition();

  const value = searchParams.get('tab') ?? 'threads';

  const onValueChange = useCallback(
    (type: string) => {
      const path = `${pathname}?${createQueryString(searchParams, 'tab', type, 'set')}`;
      startTransition(() => {
        router.replace(path);
      });
    },
    [pathname, createQueryString, searchParams, router],
  );

  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList className="w-full">
        <TabsTrigger value="threads" className="flex-1">
          스레드
        </TabsTrigger>
        <TabsTrigger value="comments" className="flex-1">
          답글
        </TabsTrigger>
        <TabsTrigger value="reposts" className="flex-1">
          리포스트
        </TabsTrigger>
      </TabsList>
      <TabsContent value="threads">{threads}</TabsContent>
      <TabsContent value="comments">{comments}</TabsContent>
      <TabsContent value="reposts">{reposts}</TabsContent>
    </Tabs>
  );
}
