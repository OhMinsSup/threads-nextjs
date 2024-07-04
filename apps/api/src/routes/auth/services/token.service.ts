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
   * @description Find token by tokenId
   * @param {string} tokenId
   */
  async findByTokenId(tokenId: string) {
    return await this.prisma.token.findUnique({ where: { id: tokenId } });
  }

  /**
   * @description Delete token by tokenId
   * @param {string} tokenId
   */
  async deleteByTokenId(tokenId: string) {
    return await this.prisma.token.delete({ where: { id: tokenId } });
  }

  /**
   * @description Delete tokens by userId and expiresAt
   * @param {{ userId: string; expiresAt: Date; tokenType?: AppTokenType; }} args
   * @param {Prisma.TransactionClient?} tx
   */
  async deleteByExpiresAtTokens(
    {
      userId,
      expiresAt,
      tokenType,
    }: {
      userId: string;
      expiresAt: Date;
      tokenType?: AppTokenType;
    },
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const token = tx ? tx.token : this.prisma.token;
    return await token.deleteMany({
      where: {
        userId,
        expires: {
          lte: expiresAt,
        },
        ...(tokenType && { type: tokenType }),
      },
    });
  }

  /**
   * @description Generate access token
   * @param {string} userId
   */
  generateAccessToken(userId: string) {
    const expiresAt = this.env.getAccessTokenExpiresAt();

    const jwtPayload: JwtPayload = {
      sub: userId,
    };

    return {
      token: this.jwt.sign(jwtPayload),
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

    const token = tx ? tx.token : this.prisma.token;

    const refreshToken = await token.create({ data: refreshTokenPayload });

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
