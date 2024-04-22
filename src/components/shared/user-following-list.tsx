'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWindowVirtualizer } from '@tanstack/react-virtual';

import UserItem from '~/components/shared/search-user-item';
import SkeletonCardUser from '~/components/skeleton/card-user';
import { getTargetElement } from '~/libs/browser/dom';
import { api } from '~/services/trpc/react';

interface UserFollowingListProps {
  userId: string;
}

const CLIENT_LIMIT_SIZE = 10;
const CLIENT_DATA_OVERSCAN = 5;

const getCursorLimit = (searchParams: URLSearchParams) => ({
  start: Number(searchParams.get('start') ?? '0'),
  cursor: searchParams.get('cursor') ?? null,
  limit: Number(searchParams.get('limit') ?? CLIENT_LIMIT_SIZE.toString()),
});

export default function UserFollowingList({ userId }: UserFollowingListProps) {
  const seachParams = useSearchParams();

  const MIN_ITEM_SIZE = 60;

  const [data, { fetchNextPage, hasNextPage, isFetchingNextPage }] =
    api.users.getFollowing.useSuspenseInfiniteQuery(
      {
        userId,
      },
      {
        staleTime: 2 * 60 * 1000,
        getNextPageParam: (lastPage) => {
          return lastPage.hasNextPage && lastPage.endCursor
            ? lastPage.endCursor
            : null;
        },
      },
    );

  const totalCount = data.pages.at(0)?.totalCount ?? 0;
  const flatList = data.pages.map((page) => page.list).flat() ?? [];

  const initialRect = useMemo(() => {
    return {
      width: 0,
      height: MIN_ITEM_SIZE * CLIENT_DATA_OVERSCAN,
    };
  }, []);

  const { start, cursor, limit } = getCursorLimit(seachParams);
  const [initialStart] = useState(() => start);
  const isMountedRef = useRef(false);

  const $list = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useWindowVirtualizer({
    count: hasNextPage ? flatList.length + 1 : flatList.length,
    estimateSize: () => MIN_ITEM_SIZE,
    overscan: CLIENT_DATA_OVERSCAN,
    scrollMargin: getTargetElement($list)?.offsetTop ?? 0,
    initialRect,
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= flatList.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasNextPage,
    fetchNextPage,
    flatList.length,
    isFetchingNextPage,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    rowVirtualizer.getVirtualItems(),
  ]);

  return (
    <div ref={$list} data-hydrating-signal className="max-w-full">
      <div
        className="relative w-full"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const isLoaderRow = virtualRow.index > flatList.length - 1;
          const item = flatList.at(virtualRow.index);
          const isEnd = totalCount === virtualRow.index + 1;

          if (isLoaderRow) {
            return (
              <div
                key={`search:loading:${virtualRow.index}`}
                className="absolute left-0 top-0 w-full"
                style={{
                  height: virtualRow.size,
                  transform: `translateY(${
                    virtualRow.start - rowVirtualizer.options.scrollMargin
                  }px)`,
                }}
              >
                <SkeletonCardUser />
              </div>
            );
          }

          if (!item) {
            return null;
          }

          return (
            <div
              key={`user:followers:${item.id}`}
              className="absolute left-0 top-0 w-full"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${
                  virtualRow.start - rowVirtualizer.options.scrollMargin
                }px)`,
              }}
            >
              <UserItem item={item as unknown as any} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
