import { HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { assertHttpError } from "src/libs/error";

import { Prisma } from "@thread/db";
import { HttpResultStatus } from "@thread/enum/result-status";

import { EnvironmentService } from "../../../integrations/environment/environment.service";
import { LoggerService } from "../../../integrations/logger/logger.service";
import { PrismaService } from "../../../integrations/prisma/prisma.service";
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

  async generateAccessToken(
    userId: string,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const expiresAt = this.env.getAccessTokenExpiresAt();

    const user = tx
      ? await tx.user.findUnique({ where: { id: userId } })
      : await this.prisma.user.findUnique({ where: { id: userId } });

    assertHttpError(
      !user,
      {
        resultCode: HttpResultStatus.NOT_EXIST,
        message: "가입되지 않은 사용자 입니다.",
        error: null,
        result: null,
      },
      "가입되지 않은 사용자 입니다.",
      HttpStatus.NOT_FOUND,
    );

    const jwtPayload: JwtPayload = {
      sub: user.id,
    };

    return {
      token: this.jwt.sign(jwtPayload),
      expiresAt,
    };
  }

  async generateRefreshToken(userId: string) {
    const secret = this.env.getRefreshTokenSecret();
    const expiresAt = this.env.getRefreshTokenExpiresAt();

    const refreshTokenPayload = {
      userId,
      expiresAt,
      // type: AppTokenType.RefreshToken,
    };
    const jwtPayload = {
      sub: userId,
    };

    // const refreshToken = this.appTokenRepository.create(refreshTokenPayload);

    // await this.appTokenRepository.save(refreshToken);

    // return {
    //   token: this.jwtService.sign(jwtPayload, {
    //     secret,
    //     expiresIn,
    //     // Jwtid will be used to link RefreshToken entity to this token
    //     jwtid: refreshToken.id,
    //   }),
    //   expiresAt,
    // };
  }
}
