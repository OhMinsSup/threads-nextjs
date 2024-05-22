import React from 'react';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import truncate from 'lodash-es/truncate';

import ThreadItem from '~/components/shared/thread-item';
import { SITE_CONFIG } from '~/constants/constants';
import { api } from '~/services/trpc/server';

interface PagesProps {
  params: {
    userId: string;
    threadId: string;
  };
}

export async function generateMetadata({
  params,
}: Pick<PagesProps, 'params'>): Promise<Metadata> {
  const initialData = await api.threads.byId(params);
  // html 태그를 전부 제거하고 text만 가져옵니다.
  const descriptionWithoutHTML =
    initialData?.text.replace(/(?<temp2><(?<temp1>[^>]+)>)/gi, '') ?? '';
  const description = truncate(descriptionWithoutHTML, { length: 20 });
  const username = initialData?.user.username;
  const title = username
    ? `@${username} • ${description}• ${SITE_CONFIG.title}`
    : SITE_CONFIG.title;
  return {
    title,
    openGraph: {
      title,
    },
  };
}

export default async function Pages({ params }: PagesProps) {
  const initialData = await api.threads.byId(params);
  if (!initialData) {
    notFound();
  }
  return <ThreadItem item={initialData} />;
}

export const dynamic = 'force-dynamic';
