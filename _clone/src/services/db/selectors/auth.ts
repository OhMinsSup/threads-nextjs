import { Prisma } from '@prisma/client';

export const getAuthCredentialsSelector = () =>
  Prisma.validator<Prisma.UserSelect>()({
    id: true,
    name: true,
    username: true,
    password: true,
    salt: true,
    email: true,
    image: true,
    emailVerified: true,
    profile: {
      select: getUserProfileSelector(),
    },
  });

export const getUserSimpleSelector = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    id: true,
    name: true,
    username: true,
  });
};

export const getUserProfileSelector = () => {
  return Prisma.validator<Prisma.UserProfileSelect>()({
    bio: true,
  });
};

export const getUserSelector = (userId?: string) => {
  return Prisma.validator<Prisma.UserSelect>()({
    id: true,
    name: true,
    username: true,
    email: true,
    image: true,
    emailVerified: true,
    profile: {
      select: getUserProfileSelector(),
    },
    followers: userId
      ? {
          where: {
            userId,
          },
        }
      : false,
    _count: {
      select: {
        followers: true,
        following: true,
      },
    },
  });
};

export const getFollowWithUserSelector = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    id: true,
    name: true,
    username: true,
    email: true,
    image: true,
    emailVerified: true,
    profile: {
      select: getUserProfileSelector(),
    },
    followers: {
      select: {
        user: {
          select: getUserSelector(),
        },
      },
    },
    following: {
      select: {
        user: {
          select: getUserSelector(),
        },
      },
    },
    _count: {
      select: {
        followers: true,
        following: true,
      },
    },
  });
};

export const getTagsSimpleSelector = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    id: true,
    name: true,
  });
};

export const getTagsSelector = () =>
  Prisma.validator<Prisma.TagSelect>()({
    id: true,
    name: true,
    createdAt: true,
  });
