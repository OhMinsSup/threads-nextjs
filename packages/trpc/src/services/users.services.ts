import { remember } from "@epic-web/remember";
import { TRPCError } from "@trpc/server";

import { prisma } from "@thread/db";
import { getFullExternalUserSelector } from "@thread/db/selectors";
import { FormFieldsSchem as $SignupFormFieldsSchem } from "@thread/validators/signup";
import { type UpdateProfileInputSchema } from "@thread/validators/user";

export class UsersService {
  /**
   * @description 회원가입
   * @param {$SignupFormFieldsSchem} input - 회원가입 정보
   */
  async signup(input: $SignupFormFieldsSchem) {
    const user = await prisma.user.findFirst({
      where: {
        username: input.username,
      },
    });

    if (user) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "이미 사용 중인 아이디입니다.",
      });
    }

    const salt = await generateSalt();
    const hash = await generateHash(input.password, salt);

    const searchParams = new URLSearchParams();
    searchParams.append("seed", input.username);
    const defaultImage = API_ENDPOINTS.avatar(searchParams);
    const name = generatorName(input.username);

    return await prisma.user.create({
      data: {
        name,
        username: input.username,
        password: hash,
        salt,
        image: defaultImage,
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
   * @description 유저 팔로우
   * @param {string} userId - 팔로우 하는 유저 ID
   * @param {string} targetId - 팔로우 대상 유저 ID
   */
  async follow(userId: string, targetId: string) {
    if (userId === targetId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "자신을 팔로우 할 수 없습니다.",
      });
    }

    const following = await this.byId(userId);
    if (!following) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "팔로우 정보를 찾을 수 없습니다.",
      });
    }

    const follower = await this.byId(targetId);
    if (!follower) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "팔로우 대상을 찾을 수 없습니다.",
      });
    }

    const exists = await prisma.userFollow.findFirst({
      where: {
        userId,
        followerId: targetId,
      },
    });

    if (exists) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "이미 팔로우 중입니다.",
      });
    }

    const relationship = await prisma.userFollow.create({
      data: {
        userId,
        followerId: targetId,
      },
    });

    return relationship;
  }

  /**
   * @description 유저 언팔로우
   * @param {string} userId - 팔로우 하는 유저 ID
   * @param {string} targetId - 팔로우 대상 유저 ID
   */
  async unfollow(userId: string, targetId: string) {
    if (userId === targetId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "자신을 언팔로우 할 수 없습니다.",
      });
    }

    const following = await this.byId(userId);
    if (!following) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "팔로우 정보를 찾을 수 없습니다.",
      });
    }

    const follower = await this.byId(targetId);
    if (!follower) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "팔로우 대상을 찾을 수 없습니다.",
      });
    }

    const relationship = await prisma.userFollow.deleteMany({
      where: {
        userId,
        followerId: targetId,
      },
    });

    return relationship;
  }

  /**
   * @description 프로필 업데이트
   * @param {string} userId - 유저 ID
   * @param {UpdateProfileInputSchema} input - 프로필 업데이트 정보
   */
  async update(userId: string, input: UpdateProfileInputSchema) {
    const item = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        profile: true,
      },
    });

    if (!item) {
      throw new TRPCError({ code: "NOT_FOUND", message: "item not found" });
    }

    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: input.name,
        profile: {
          update: {
            bio: input.bio,
            website: input.website,
          },
        },
      },
    });
  }

  /**
   * @description 유저 아이디로 조회
   * @param {string} userId - 유저 ID
   * @param {string?} sessionUserId - 조회하는 유저 ID
   */
  byId(userId: string, sessionUserId?: string) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: getFullExternalUserSelector({
        userId: sessionUserId,
      }),
    });
  }

  /**
   * @description 유저 이름으로 조회
   * @param {string} username - 유저 이름
   */
  byUsername(username: string) {
    return prisma.user.findUnique({
      where: {
        username,
      },
      select: getFullExternalUserSelector({
        userId: undefined,
      }),
    });
  }

  /**
   * @description 멘션 팝업 리스트에서 보여주기 위한 유저 리스트 조회
   * @param {string} keyword - 검색 키워드
   * @param {string} userId - 유저 ID
   */
  getMentionUsers(keyword: string, userId: string) {
    return prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
        username: {
          contains: keyword,
        },
      },
      take: 10,
      select: getFullExternalUserSelector({
        userId: undefined,
      }),
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  /**
   * @description 팔로워 리스트 조회
   * @param {string} userId - 유저 ID
   */
  getFollowers(userId: string, input: UserFollowListQuerySchema) {
    return db.user.findMany({
      where: {
        followers: {
          some: {
            userId: input.userId,
          },
        },
      },
      select: getFollowWithUserSelector(),
    });
  }

  /**
   * @description 팔로잉 리스트 조회
   * @param {string} userId - 유저 ID
   */
  getFollowing(userId: string, input: UserFollowListQuerySchema) {
    return db.user.findMany({
      where: {
        following: {
          some: {
            userId: input.userId,
          },
          none: {
            userId,
          },
        },
      },
      select: getFollowWithUserSelector(),
    });
  }

  /**
   * @description 팔로워 수 조회
   * @param {string} userId - 유저 ID
   */
  followersCount(userId: string, input: UserFollowListQuerySchema) {
    return db.user.count({
      where: {
        followers: {
          some: {
            userId: input.userId,
          },
        },
      },
    });
  }

  /**
   * @description 팔로잉 수 조회
   * @param {string} userId - 유저 ID
   */
  followingCount(userId: string, input: UserFollowListQuerySchema) {
    return db.user.count({
      where: {
        following: {
          some: {
            userId: input.userId,
          },
          none: {
            userId,
          },
        },
      },
    });
  }

  /**
   * @description 팔로워 페이지 여부
   * @param {string} userId - 유저 ID
   * @param {string} endCursor - 마지막 커서
   */
  hasNextFollowserPage(
    userId: string,
    endCursor: string,
    input: UserFollowListQuerySchema,
  ) {
    return db.user.count({
      where: {
        followers: {
          some: {
            userId: input.userId,
          },
        },
        id: {
          lt: endCursor,
        },
      },
    });
  }

  /**
   * @description 팔로잉 페이지 여부
   * @param {string} userId - 유저 ID
   * @param {string} endCursor - 마지막 커서
   */
  hasNextFollowingPage(
    userId: string,
    endCursor: string,
    input: UserFollowListQuerySchema,
  ) {
    return db.user.count({
      where: {
        following: {
          some: {
            userId: input.userId,
          },
          none: {
            userId,
          },
        },
        id: {
          lt: endCursor,
        },
      },
    });
  }
}

export const usersService =
  process.env.NODE_ENV === "development"
    ? new UserService()
    : remember("usersService", () => new UserService());
