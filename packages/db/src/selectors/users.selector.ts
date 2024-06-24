import { Prisma } from "..";

export const getUserSettingSelector = () => {
  return Prisma.validator<Prisma.UserSettingsSelect>()({
    privacySettings: true,
  });
};

export const getUserProfileSelector = () => {
  return Prisma.validator<Prisma.UserProfileSelect>()({
    bio: true,
    website: true,
  });
};

export const getPasswordSelector = () => {
  return Prisma.validator<Prisma.PasswordSelect>()({
    hash: true,
    salt: true,
  });
};

export const getBaseUserEtcSelector = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    deletedAt: true,
    lastActiveAt: true,
    isSuspended: true,
  });
};

export const getBaseUserSelector = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    id: true,
    email: true,
    emailVerified: true,
    name: true,
    image: true,
  });
};

export const getUserSelector = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    ...getBaseUserSelector(),
    ...getBaseUserEtcSelector(),
    UserProfile: {
      select: getUserProfileSelector(),
    },
    UserSettings: {
      select: getUserSettingSelector(),
    },
  });
};

export const getExternalUserSelector = () => getUserSelector();

export const getInternalUserSelector = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    ...getExternalUserSelector(),
    Password: {
      select: getPasswordSelector(),
    },
  });
};

export type UserPayload = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserSelector>;
}>;

export type UserInternalPayload = Prisma.UserGetPayload<{
  select: ReturnType<typeof getInternalUserSelector>;
}>;

export type UserExternalPayload = Prisma.UserGetPayload<{
  select: ReturnType<typeof getExternalUserSelector>;
}>;
