import React from 'react';

import ClientOnly from '~/components/shared/client-only';
import ThreadList from '~/components/shared/thread-list';
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
        <ThreadList userId={params.userId} type="comment" />
      </React.Suspense>
    </ClientOnly>
  );
}
