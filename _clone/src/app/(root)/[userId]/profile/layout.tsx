import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ProfileHeader from '~/components/profile/profile-header';
import ProfileTabsList from '~/components/profile/profile-tabs-list';
import { SITE_CONFIG } from '~/constants/constants';
import { api } from '~/services/trpc/server';

interface LayoutProps {
  children: React.ReactNode;
  params: {
    userId: string;
  };
  comments: React.ReactNode;
  reposts: React.ReactNode;
}

export async function generateMetadata({
  params,
}: Pick<LayoutProps, 'params'>): Promise<Metadata> {
  const initialData = await api.users.byId({ userId: params.userId });
  const username = initialData?.username;
  const title = username
    ? `${SITE_CONFIG.title}의 @${initialData.username}님`
    : SITE_CONFIG.title;
  return {
    title,
    openGraph: {
      title,
    },
  };
}

export default async function Layout({
  children,
  params,
  comments,
  reposts,
}: LayoutProps) {
  const initialData = await api.users.byId({ userId: params.userId });
  if (!initialData) {
    notFound();
  }

  const session = await api.auth.getRequireSession();
  const isMe = session.user.id === initialData.id;

  return (
    <>
      <React.Suspense fallback={<></>}>
        <ProfileHeader
          userId={initialData.id}
          isMe={isMe}
          initialData={initialData}
        />
      </React.Suspense>
      <ProfileTabsList
        comments={comments}
        reposts={reposts}
        threads={children}
      />
    </>
  );
}
