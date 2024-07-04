import { Prisma } from "..";
import { getTagSelector } from "./tags.selector";
import { getBaseUserSelector } from "./users.selector";

export const getPostConfigSelector = () => {
  return Prisma.validator<Prisma.PostConfigSelect>()({
    postId: true,
    whoCanLeaveComments: true,
    hiddenNumberOfLikesAndComments: true,
    pinned: true,
  });
};

export type PostConfigPayload = Prisma.PostConfigGetPayload<{
  select: ReturnType<typeof getPostConfigSelector>;
}>;

export const getPostStatsSelector = () => {
  return Prisma.validator<Prisma.PostStatsSelect>()({
    postId: true,
    score: true,
    likes: true,
    reposts: true,
    comments: true,
  });
};

export type PostStatsPayload = Prisma.PostStatsGetPayload<{
  select: ReturnType<typeof getPostStatsSelector>;
}>;

export const getPostLikeSelector = () => {
  return Prisma.validator<Prisma.PostLikeSelect>()({
    userId: true,
    postId: true,
  });
};

export const getPostLikeWithUserSelector = () => {
  return Prisma.validator<Prisma.PostLikeSelect>()({
    userId: true,
    postId: true,
    User: {
      select: getBaseUserSelector(),
    },
  });
};

export const getPostBookmarkSelector = () => {
  return Prisma.validator<Prisma.PostBookmarkSelect>()({
    userId: true,
    postId: true,
  });
};

export const getPostBookmarkWithUserSelector = () => {
  return Prisma.validator<Prisma.PostBookmarkSelect>()({
    userId: true,
    postId: true,
    User: {
      select: getBaseUserSelector(),
    },
  });
};

export const getPostMentionSelector = () => {
  return Prisma.validator<Prisma.PostMentionSelect>()({
    userId: true,
    postId: true,
  });
};

export const getPostMentionWithUserSelector = () => {
  return Prisma.validator<Prisma.PostMentionSelect>()({
    userId: true,
    postId: true,
    User: {
      select: getBaseUserSelector(),
    },
  });
};

export const getPostTagSelector = () => {
  return Prisma.validator<Prisma.PostTagSelect>()({
    postId: true,
    tagId: true,
  });
};

export const getPostTagWithTagSelector = () => {
  return Prisma.validator<Prisma.PostTagSelect>()({
    postId: true,
    tagId: true,
    Tag: {
      select: getTagSelector(),
    },
  });
};

export const getBasePostSelector = () => {
  return Prisma.validator<Prisma.PostSelect>()({
    id: true,
    userId: true,
    text: true,
    createdAt: true,
    updatedAt: true,
  });
};

export const getPostSelector = () => {
  return Prisma.validator<Prisma.PostSelect>()({
    ...getBasePostSelector(),
    User: {
      select: getBaseUserSelector(),
    },
    PostConfig: {
      select: getPostConfigSelector(),
    },
    PostLike: {
      select: getPostLikeSelector(),
    },
    PostBookmark: {
      select: getPostBookmarkSelector(),
    },
    PostTag: {
      select: getPostTagSelector(),
    },
    PostMention: {
      select: getPostMentionSelector(),
    },
  });
};

export const getFullPostSelector = () => {
  return Prisma.validator<Prisma.PostSelect>()({
    ...getBasePostSelector(),
    User: {
      select: getBaseUserSelector(),
    },
    PostConfig: {
      select: getPostConfigSelector(),
    },
    PostLike: {
      select: getPostLikeWithUserSelector(),
    },
    PostBookmark: {
      select: getPostBookmarkWithUserSelector(),
    },
    PostTag: {
      select: getPostTagWithTagSelector(),
    },
    PostMention: {
      select: getPostMentionWithUserSelector(),
    },
  });
};

export const getExternalFullPostSelector = () => {
  return Prisma.validator<Prisma.PostSelect>()({
    ...getFullPostSelector(),
    PostStats: {
      select: getPostStatsSelector(),
    },
  });
};

export const getExternalPostSelector = () => {
  return Prisma.validator<Prisma.PostSelect>()({
    ...getPostSelector(),
    PostStats: {
      select: getPostStatsSelector(),
    },
  });
};

export const getInternalFullPostSelector = () => {
  return Prisma.validator<Prisma.PostSelect>()({
    ...getFullPostSelector(),
  });
};

export const getInternalPostSelector = () => {
  return Prisma.validator<Prisma.PostSelect>()({
    ...getPostSelector(),
  });
};

export type PostPayload = Prisma.PostGetPayload<{
  select: ReturnType<typeof getPostSelector>;
}>;

export type PostInternalPayload = Prisma.PostGetPayload<{
  select: ReturnType<typeof getInternalPostSelector>;
}>;

export type PostExternalPayload = Prisma.PostGetPayload<{
  select: ReturnType<typeof getExternalPostSelector>;
}>;

export type PostInternalFullPayload = Prisma.PostGetPayload<{
  select: ReturnType<typeof getInternalFullPostSelector>;
}>;

export type PostExternalFullPayload = Prisma.PostGetPayload<{
  select: ReturnType<typeof getExternalFullPostSelector>;
}>;
