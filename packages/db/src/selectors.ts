import { Prisma } from "@prisma/client";

export const getUserSimpleSelector = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    id: true,
    name: true,
    username: true,
  });
};

export const getUserProfileSelector = () =>
  Prisma.validator<Prisma.UserProfileSelect>()({
    bio: true,
    website: true,
  });

export const getUserCountSelector = () =>
  Prisma.validator<Prisma.UserCountOutputTypeSelect>()({
    followers: true,
    following: true,
  });

export const getBaseUserSelector = () =>
  Prisma.validator<Prisma.UserSelect>()({
    id: true,
    name: true,
    username: true,
    email: true,
    image: true,
    emailVerified: true,
  });

export const getInternalUserSelector = () =>
  Prisma.validator<Prisma.UserSelect>()({
    ...getBaseUserSelector(),
    password: true,
    salt: true,
  });

export const getExternalUserSelector = () =>
  Prisma.validator<Prisma.UserSelect>()({
    ...getBaseUserSelector(),
    profile: {
      select: getUserProfileSelector(),
    },
  });

interface GetFullExternalUserSelectorParams {
  userId?: string;
}

export const getFullExternalUserSelector = ({
  userId,
}: GetFullExternalUserSelectorParams) =>
  Prisma.validator<Prisma.UserSelect>()({
    ...getExternalUserSelector(),
    followers: userId
      ? {
          where: { userId },
          select: {
            user: {
              select: getExternalUserSelector(),
            },
          },
        }
      : false,
    _count: {
      select: getUserCountSelector(),
    },
  });

export const getTagsSelector = () =>
  Prisma.validator<Prisma.TagSelect>()({
    id: true,
    name: true,
    createdAt: true,
  });

export const getThreadStatsSelector = () =>
  Prisma.validator<Prisma.ThreadStatsSelect>()({
    likes: true,
    reposts: true,
    score: true,
  });

export const getThreadsMentionsSelector = () =>
  Prisma.validator<Prisma.ThreadMentionSelect>()({
    user: {
      select: getUserSimpleSelector(),
    },
  });

export const getThreadsTagsSelector = () =>
  Prisma.validator<Prisma.ThreadTagSelect>()({
    tag: {
      select: getTagsSelector(),
    },
  });

export const getBaseThreadSelector = () =>
  Prisma.validator<Prisma.ThreadSelect>()({
    id: true,
    text: true,
    level: true,
    jsonString: true,
    createdAt: true,
    whoCanLeaveComments: true,
    hiddenNumberOfLikesAndComments: true,
    deleted: true,
  });

export const getThreadCountSelector = () =>
  Prisma.validator<Prisma.ThreadCountOutputTypeSelect>()({
    likes: true,
    reposts: true,
  });

export const getSimpleThreadsSelector = () =>
  Prisma.validator<Prisma.ThreadSelect>()({
    ...getBaseThreadSelector(),
    user: {
      select: getUserSimpleSelector(),
    },
    _count: {
      select: getThreadCountSelector(),
    },
  });

interface GetFullThreadsParams {
  userId?: string;
}

export const getFullThreadsSelector = ({ userId }: GetFullThreadsParams) =>
  Prisma.validator<Prisma.ThreadSelect>()({
    ...getBaseThreadSelector(),
    user: {
      select: getUserSimpleSelector(),
    },
    mentions: {
      select: getThreadsMentionsSelector(),
    },
    tags: {
      select: getThreadsTagsSelector(),
    },
    stats: {
      select: getThreadStatsSelector(),
    },
    reposts: userId ? { where: { userId } } : false,
    likes: userId ? { where: { userId } } : false,
    bookmarks: userId ? { where: { userId } } : false,
    _count: {
      select: getThreadCountSelector(),
    },
  });
