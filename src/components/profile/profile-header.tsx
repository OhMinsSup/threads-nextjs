'use client';

import React, { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Icons } from '~/components/icons';
import UserFollowerList from '~/components/shared/user-follower-list';
import UserFollowingList from '~/components/shared/user-following-list';
import SkeletonCardUserList from '~/components/skeleton/card-user-list';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import useNavigateThreanForm from '~/libs/hooks/useNavigateThreanForm';
import { api } from '~/services/trpc/react';

interface ProfileHeaderProps {
  userId: string;
  isMe: boolean;
  initialData?: any;
}

export default function ProfileHeader({
  userId,
  isMe,
  initialData,
}: ProfileHeaderProps) {
  const [data] = api.users.byId.useSuspenseQuery(
    {
      userId,
    },
    {
      initialData,
    },
  );

  const followCount = data?._count.followers ?? 0;
  const isFollowing = (data?.followers?.length ?? 0) > 0;

  const router = useRouter();

  const onClickMoveToEdit = useCallback(() => {
    router.push(PAGE_ENDPOINTS.PROFILE.EDIT);
  }, [router]);

  return (
    <div className="py-4">
      <div className="grid-cols-max grid items-center gap-4">
        <div className="col-start-1">
          <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {data?.username}
          </h2>
          <div className="mt-[2px]">
            <div className="flex items-center">
              <small className="text-sm font-medium leading-none">
                @{data?.name}
              </small>
            </div>
          </div>
        </div>
        <div className="col-start-2">
          <div className="text-align-inherit m-0 box-border flex cursor-pointer touch-manipulation rounded-full border-0 bg-transparent p-0 outline-none">
            <div className="size-[64px] md:size-[84px]">
              <div className="flex size-full rounded-full bg-white">
                <img
                  height="100%"
                  width="100%"
                  alt={`${data?.username}님의 프로필 사진`}
                  className="profile-outline size-full rounded-full object-cover"
                  src={data?.image ?? undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <DialogFollowersViewButton userId={userId} followCount={followCount} />
      {!isMe ? (
        <div className="mt-4 flex w-full space-x-2">
          <FollowButton userId={userId} isFollowing={isFollowing} />
          <MentionButton
            userId={userId}
            username={data?.username}
            name={data?.name}
          />
        </div>
      ) : (
        <Button
          className="my-3 w-full"
          variant="outline"
          onClick={onClickMoveToEdit}
        >
          프로필 편집
        </Button>
      )}
    </div>
  );
}

interface DialogFollowersViewButtonProps {
  userId: string;
  followCount: number;
}

function DialogFollowersViewButton({
  userId,
  followCount,
}: DialogFollowersViewButtonProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="link" className="p-0">
          팔로우 {followCount}명
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>팔로워</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="follower" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="follower">팔로워</TabsTrigger>
            <TabsTrigger value="following">팔로잉</TabsTrigger>
          </TabsList>
          <TabsContent value="follower">
            <React.Suspense fallback={<SkeletonCardUserList />}>
              <UserFollowerList userId={userId} />
            </React.Suspense>
          </TabsContent>
          <TabsContent value="following">
            <React.Suspense fallback={<SkeletonCardUserList />}>
              <UserFollowingList userId={userId} />
            </React.Suspense>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

interface MentionButtonProps {
  userId: string;
  username: string | null | undefined;
  name: string | null | undefined;
}

function MentionButton(props: MentionButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { handleHref, isPending } = useNavigateThreanForm();

  const onClickMentions = useCallback(() => {
    handleHref({
      intialValue: props,
    });
  }, [handleHref, props]);

  return (
    <Button variant="outline" className="flex-1" onClick={onClickMentions}>
      {isPending ? (
        <Icons.rotateCcw className="mr-2 size-4 animate-spin" />
      ) : null}
      언급
    </Button>
  );
}

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
}

function FollowButton({ userId, isFollowing }: FollowButtonProps) {
  const utils = api.useUtils();

  const followMutation = api.users.follow.useMutation({
    async onSuccess() {
      await utils.users.byId.invalidate();
    },
  });

  const unfollowMutation = api.users.unfollow.useMutation({
    async onSuccess() {
      await utils.users.byId.invalidate();
    },
  });

  const isPending = followMutation.isPending || unfollowMutation.isPending;

  const onClickFollow = useCallback(() => {
    if (isFollowing) {
      unfollowMutation.mutate({ targetId: userId });
    } else {
      followMutation.mutate({ targetId: userId });
    }
  }, [followMutation, isFollowing, unfollowMutation, userId]);

  return (
    <Button className="flex-1" onClick={onClickFollow} disabled={isPending}>
      {isPending ? (
        <Icons.spinner className="mr-2 size-4 animate-spin" />
      ) : null}
      {isFollowing ? '팔로우 취소' : '팔로우'}
    </Button>
  );
}
