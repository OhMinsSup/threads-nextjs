import { Prisma } from "..";

export const getBaseTagSelector = () => {
  return Prisma.validator<Prisma.TagSelect>()({
    id: true,
    name: true,
    createdAt: true,
    updatedAt: true,
  });
};

export const getTagSelector = () => {
  return Prisma.validator<Prisma.TagSelect>()({
    ...getBaseTagSelector(),
  });
};

export type TagPayload = Prisma.TagGetPayload<{
  select: ReturnType<typeof getTagSelector>;
}>;
