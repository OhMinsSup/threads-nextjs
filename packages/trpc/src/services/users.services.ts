import { remember } from "@epic-web/remember";

import type { FormFieldsSchema } from "@thread/validators/signup";
import { prisma } from "@thread/db";
import { getBaseUserSelector } from "@thread/db/selectors";
import { HttpStatus } from "@thread/enum/http-status";
import { createError } from "@thread/error/http";
import { generateHash, generateSalt } from "@thread/shared/password";
import { generatorName } from "@thread/shared/utils";

export class UsersService {
  /**
   * @description 회원가입
   * @param {FormFieldsSchema} input - 회원가입 정보
   */
  async signup(input: FormFieldsSchema) {
    const user = await prisma.user.findFirst({
      where: {
        username: input.username,
      },
    });

    if (user) {
      throw createError({
        message: "이미 사용 중인 아이디입니다.",
        status: HttpStatus.BAD_REQUEST,
        data: null,
      });
    }

    const salt = await generateSalt();
    const hash = await generateHash(input.password, salt);

    const name = generatorName(input.username);

    return await prisma.user.create({
      data: {
        name,
        username: input.username,
        password: hash,
        salt,
        image: undefined,
        profile: {
          create: {
            bio: undefined,
            website: undefined,
          },
        },
      },
    });
  }

  /**
   * @description 멘션 팝업 리스트에서 보여주기 위한 유저 리스트 조회
   * @param {string} keyword - 검색 키워드
   */
  async getSimpleUsers(keyword: string) {
    return prisma.user.findMany({
      where: {
        username: {
          contains: keyword,
        },
      },
      take: 10,
      select: getBaseUserSelector(),
      orderBy: {
        createdAt: "asc",
      },
    });
  }
}

export const usersService =
  process.env.NODE_ENV === "development"
    ? new UsersService()
    : remember("usersService", () => new UsersService());
