import React, { useCallback } from 'react';
import Link from 'next/link';

import { Icons } from '~/components/icons';
import Avatars from '~/components/shared/avatars';
import { Button } from '~/components/ui/button';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import { UserSelectSchema } from '~/services/db/selectors/users';
import { api } from '~/services/trpc/react';

interface UserItemProps {
  item: UserSelectSchema;
}

export default function SearchUserItem({ item }: UserItemProps) {
  return (
    <div className="m-3 flex items-center justify-between space-x-4">
      <SearchUserItem.Content item={item} />
    </div>
  );
}

interface SearchUserItemProps {
  item: UserSelectSchema;
}

SearchUserItem.Content = function Item({ item }: SearchUserItemProps) {
  const followMutation = api.users.follow.useMutation();

  const unfollowMutation = api.users.unfollow.useMutation();

  const isPending = followMutation.isPending || unfollowMutation.isPending;
  const isFollowing = (item.followers?.length ?? 0) > 0;

  const onClickFollow = useCallback(() => {
    if (isFollowing) {
      unfollowMutation.mutate({ targetId: item.id });
    } else {
      followMutation.mutate({ targetId: item.id });
    }
  }, [followMutation, isFollowing, item.id, unfollowMutation]);

  return (
    <>
      <div className="flex items-center space-x-4">
        <Avatars
          src={undefined}
          alt={`${item.username} profile picture`}
          fallback="T"
        />
        <div>
          <Link href={PAGE_ENDPOINTS.USER.ID(item.id)}>
            <p className="text-sm font-medium leading-none">{item.username}</p>
          </Link>
          <p className="text-sm text-muted-foreground">
            팔로우 {item._count.followers ?? 0}명
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        className="ml-auto"
        onClick={onClickFollow}
        disabled={isPending}
      >
        {isPending ? (
          <Icons.spinner className="mr-2 size-4 animate-spin" />
        ) : null}
        {isFollowing ? '팔로우 취소' : '팔로우'}
      </Button>
    </>
  );
};
