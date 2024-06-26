'use client';

import React from 'react';

import SearchInput from '~/components/search/search-input';
import SearchWapper from '~/components/search/search-wrapper';
import SearchList from '~/components/shared/search-list';
import SkeletonCardUserList from '~/components/skeleton/card-user-list';

interface SearchProps {
  keyword?: string;
  searchType: 'tags' | 'mentions' | 'default' | undefined;
  tagId?: string | undefined;
  userId?: string | undefined;
}

export default function Search(props: SearchProps) {
  return (
    <>
      <SearchInput initialKeyword={props.keyword} />
      <SearchWapper>
        <React.Suspense fallback={<SkeletonCardUserList />}>
          <SearchList {...props} />
        </React.Suspense>
      </SearchWapper>
    </>
  );
}
