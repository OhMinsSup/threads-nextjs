import React from 'react';

import ClientOnly from '~/components/shared/client-only';
import ThreadRepostList from '~/components/shared/thread-repost-list';
import SkeletonCardList from '~/components/skeleton/card-thread-list';

interface PagesProps {
  params: {
    userId: string;
  };
}

export default function Pages({ params }: PagesProps) {
  return (
    <ClientOnly fallback={<SkeletonCardList />}>
      <React.Suspense fallback={<SkeletonCardList />}>
        <ThreadRepostList userId={params.userId} />
      </React.Suspense>
    </ClientOnly>
  );
}
