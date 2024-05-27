import { remember } from "@epic-web/remember";

import type { FormFieldsCreateSchema } from "@thread/validators/tag";
import { prisma } from "@thread/db";
import { getTagsSelector } from "@thread/db/selectors";

export class TagsService {
  /**
   * @description 태그 상세 조회
   * @param {string} id - 태그 ID
   */
  byId(id: string) {
    return prisma.tag.findUnique({
      where: { id },
      select: getTagsSelector(),
    });
  }

  /**
   * @description 태그 이름으로 조회
   * @param {string} name - 태그 이름
   */
  byName(name: string) {
    return prisma.tag.findUnique({
      where: { name },
      select: getTagsSelector(),
    });
  }

  /**
   * @description 태그 생성
   * @param {string} _ - 유저 ID
   * @param {FormFieldsCreateSchema} input - 생성할 태그 데이터
   */
  create(_: string, input: FormFieldsCreateSchema) {
    return prisma.tag.create({
      select: getTagsSelector(),
      data: {
        name: input.name,
      },
    });
  }

  /**
   * @description 태그 스키마와 스레드 스키마를 연결
   * @param {string} tagId - 태그 ID
   * @param {string} threadId - 스레드 ID
   */
  async connectOrCreateTag(tagId: string, threadId: string) {
    const exists = await prisma.threadTag.findFirst({
      where: {
        threadId,
        tagId,
      },
    });

    if (exists) {
      return exists;
    }

    const data = await prisma.threadTag.create({
      data: {
        threadId,
        tagId,
      },
    });

    return data;
  }

  /**
   * @description 멘션 팝업 리스트에서 보여주기 위한 태그 리스트 조회
   * @param {string} keyword - 검색 키워드
   */
  getSimpleTags(keyword: string) {
    return prisma.tag.findMany({
      where: {
        name: {
          contains: keyword,
        },
      },
      take: 10,
      select: getTagsSelector(),
      orderBy: {
        createdAt: "asc",
      },
    });
  }
}

export const tagsService =
  process.env.NODE_ENV === "development"
    ? new TagsService()
    : remember("tagsService", () => new TagsService());
