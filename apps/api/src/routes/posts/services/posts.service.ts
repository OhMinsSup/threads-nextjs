import { Injectable } from "@nestjs/common";

import type { UserExternalPayload } from "@thread/db/selectors";
import { HttpResultStatus } from "@thread/sdk/enum";

import { EnvironmentService } from "../../../integrations/environment/environment.service";
import { LoggerService } from "../../../integrations/logger/logger.service";
import { PrismaService } from "../../../integrations/prisma/prisma.service";
import { TagsService } from "../../../routes/tags/services/tags.service";
import { UsersService } from "../../../routes/users/services/users.service";
import { PostListQuery } from "../dto/post-list.dto";
import { PublishDTO } from "../dto/publish.dto";

@Injectable()
export class PostsService {
  private _contextName = "post - service";

  constructor(
    private readonly env: EnvironmentService,
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly users: UsersService,
    private readonly tags: TagsService,
  ) {}

  /**
   * @description Get a list of posts
   * @param {PostListQuery} query
   * @param {UserExternalPayload | null} user
   */
  async list(query: PostListQuery, user: UserExternalPayload | null) {
    const { pageNo, limit } = query;

    const [totalCount, list] = await Promise.all([
      this.prisma.post.count({
        where: {
          ...(user && {
            id: {
              not: user.id,
            },
          }),
        },
      }),
      this.prisma.user.findMany({
        where: {
          ...(user && {
            id: {
              not: user.id,
            },
          }),
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (pageNo - 1) * limit,
        take: limit,
      }),
    ]);

    const hasNextPage = totalCount > pageNo * limit;

    return {
      resultCode: HttpResultStatus.OK,
      message: null,
      error: null,
      result: {
        totalCount,
        list,
        pageInfo: {
          currentPage: pageNo,
          hasNextPage,
          nextPage: hasNextPage ? pageNo + 1 : null,
        },
      },
    };
  }

  /**
   * @description Publish a post
   * @param {PublishDTO} input
   * @param {UserExternalPayload} user
   */
  async publish(input: PublishDTO, user: UserExternalPayload) {
    const databaesType = await this.prisma.getDatabaseType();

    return await this.prisma.$transaction(async (prisma) => {
      const hashTagIds: string[] = [];
      if (input.hashTags && input.hashTags.length > 0) {
        for (const hashTag of input.hashTags) {
          const tag = await this.tags.getTagByName(hashTag);
          if (tag) {
            hashTagIds.push(tag.id);
          } else {
            const newTag = await this.tags.createTag(hashTag, prisma);
            hashTagIds.push(newTag.id);
          }
        }
      }

      const mentionIds: string[] = [];
      if (input.mentions && input.mentions.length > 0) {
        for (const mention of input.mentions) {
          const user = await this.users.getUserByUsername(mention);
          if (user) {
            mentionIds.push(user.id);
          }
        }
      }

      let meta: Record<string, any> | string | undefined;
      if (input.meta && Object.keys(input.meta).length > 0) {
        if (databaesType === "postgresql") {
          meta = input.meta;
        } else {
          meta = JSON.stringify(input.meta);
        }
      }

      const data = await prisma.post.create({
        data: {
          text: input.text,
          userId: user.id,
          PostConfig: {
            create: {},
          },
          PostStats: {
            create: {},
          },
          ...(meta && {
            meta: meta as unknown as any,
          }),
          ...(hashTagIds.length > 0 && {
            PostTag: {
              create: hashTagIds.map((id) => ({ tagId: id })),
            },
          }),
          ...(mentionIds.length > 0 && {
            PostMention: {
              create: mentionIds.map((id) => ({ userId: id })),
            },
          }),
        },
      });

      return {
        resultCode: HttpResultStatus.OK,
        message: null,
        error: null,
        result: {
          id: data.id,
        },
      };
    });
  }
}
