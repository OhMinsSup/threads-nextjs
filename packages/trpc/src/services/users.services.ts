import { remember } from "@epic-web/remember";

import type { FormFieldsSchema } from "@thread/validators/signup";
import { prisma } from "@thread/db";
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
}

export const usersService =
  process.env.NODE_ENV === "development"
    ? new UsersService()
    : remember("usersService", () => new UsersService());
