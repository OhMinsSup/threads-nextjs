import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import type { Prisma, Token } from "@thread/db";

import { EnvironmentService } from "../../../integrations/environment/environment.service";
import { LoggerService } from "../../../integrations/logger/logger.service";
import { PrismaService } from "../../../integrations/prisma/prisma.service";
import { AppTokenType } from "../../../libs/constants";
import { JwtPayload } from "../strategies/jwt.auth.strategy";

@Injectable()
export class TokenService {
  private _contextName = "token - service";

  constructor(
    private readonly prisma: PrismaService,
    private readonly env: EnvironmentService,
    private readonly jwt: JwtService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * @description Generate access token
   * @param {string} userId
   * @param {Prisma.TransactionClient} tx
   */
  generateAccessToken(userId: string) {
    const secret = this.env.getAccessTokenSecret();
    const expiresAt = this.env.getAccessTokenExpiresAt();

    const jwtPayload: JwtPayload = {
      sub: userId,
    };

    return {
      token: this.jwt.sign(jwtPayload, {
        secret,
        expiresIn: this.env.getAccessTokenExpiresIn(),
        // Jwtid will be used to link RefreshToken entity to this token
      }),
      expiresAt,
    };
  }

  /**
   * @description Generate refresh token
   * @param {string} userId
   * @param {Prisma.TransactionClient} tx
   */
  async generateRefreshToken(
    userId: string,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const secret = this.env.getRefreshTokenSecret();
    const expiresAt = this.env.getRefreshTokenExpiresAt();

    const refreshTokenPayload: Pick<Token, "type" | "expires" | "userId"> = {
      userId,
      expires: expiresAt,
      type: AppTokenType.RefreshToken,
    };

    const jwtPayload = {
      sub: userId,
    };

    const refreshToken = tx
      ? await tx.token.create({ data: refreshTokenPayload })
      : await this.prisma.token.create({ data: refreshTokenPayload });

    return {
      token: this.jwt.sign(jwtPayload, {
        secret,
        expiresIn: this.env.getRefreshTokenExpiresIn(),
        // Jwtid will be used to link RefreshToken entity to this token
        jwtid: refreshToken.id,
      }),
      expiresAt,
    };
  }
}
