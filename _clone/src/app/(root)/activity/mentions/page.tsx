import React from 'react';

import SkeletonCardList from '~/components/skeleton/card-thread-list';

export default function Pages() {
  return (
    <React.Suspense fallback={<SkeletonCardList />}>
      <div>테스트</div>
    </React.Suspense>
  );
}

export const dynamic = 'force-dynamic';
