import { Injectable } from "@nestjs/common";

import { Prisma } from "@thread/db";

import { EnvironmentService } from "../../../integrations/environment/environment.service";
import { LoggerService } from "../../../integrations/logger/logger.service";
import { PrismaService } from "../../../integrations/prisma/prisma.service";

@Injectable()
export class TagsService {
  private _contextName = "tag - service";

  constructor(
    private readonly env: EnvironmentService,
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * @description Create a tag
   * @param {string} name
   */
  async createTag(
    name: string,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const tag = tx ? tx.tag : this.prisma.tag;
    return await tag.create({
      data: {
        name,
      },
    });
  }

  /**
   * @description Get a tag by name
   * @param {string} name
   */
  getTagByName(name: string) {
    return this.prisma.tag.findUnique({
      select: {
        id: true,
        name: true,
      },
      where: { name },
    });
  }
}
