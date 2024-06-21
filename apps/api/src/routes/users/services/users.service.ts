import { Injectable } from "@nestjs/common";

import { Prisma } from "@thread/db";

import { LoggerService } from "../../../integrations/logger/logger.service";
import { PrismaService } from "../../../integrations/prisma/prisma.service";
import { EmailUserCreateDTO } from "../dto/email-user-create.dto";

@Injectable()
export class UsersService {
  private _contextName = "users - service";

  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * @description Create a user
   * @param {EmailUserCreateDTO} input
   * @param {Prisma.TransactionClient?} tx
   */
  async createUser(
    input: EmailUserCreateDTO & { salt: string },
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const user = tx ? tx.user : this.prisma.user;
    return await user.create({
      data: {
        email: input.email,
        name: input.name,
        avatarUrl: input.avatarUrl,
        lastActiveAt: new Date(),
        Password: {
          create: {
            hash: input.password,
            salt: input.salt,
          },
        },
        UserProfile: {
          create: {},
        },
        UserSettings: {
          create: {},
        },
      },
    });
  }

  /**
   * @description Get a user by id (external)
   * @param {string} id
   */
  async getExternalUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: { UserProfile: true, UserSettings: true },
    });
  }

  /**
   * @description Get a user by id (internal)
   * @param {string} id
   */
  async getInternalUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: { Password: true, UserProfile: true, UserSettings: true },
    });
  }

  /**
   * @description Get a user by email (internal)
   * @param {string} email
   */
  async getInternalUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email, deletedAt: null },
      include: { Password: true, UserProfile: true, UserSettings: true },
    });
  }
}
