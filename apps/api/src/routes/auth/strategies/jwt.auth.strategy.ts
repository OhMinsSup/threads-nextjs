import type { Request } from "express";
import { HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import type { UserExternalPayload } from "@thread/db/selectors";
import { HttpResultStatus } from "@thread/sdk/enum";

import { EnvironmentService } from "../../../integrations/environment/environment.service";
import { PrismaService } from "../../../integrations/prisma/prisma.service";
import { assertHttpError } from "../../../libs/error";
import { UsersService } from "../../../routes/users/services/users.service";

export type JwtPayload = { sub: string; jti?: string };
export type PassportUser = { user?: UserExternalPayload };

const fromCookie = (cookieName: string) => {
  return (request: Request) => {
    let token: string | null = null;
    if (request && request.cookies) {
      token = request.cookies[cookieName];
    }
    return token;
  };
};
@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private readonly env: EnvironmentService,
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        fromCookie(env.getAccessTokenName()),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: env.getAccessTokenSecret(),
    });
  }

  async validate({ sub }: JwtPayload): Promise<PassportUser> {
    const user = await this.users.getExternalUserById(sub);

    assertHttpError(
      !user,
      {
        resultCode: HttpResultStatus.LOGIN_REQUIRED,
        message: "login required",
        result: null,
      },
      "login required",
      HttpStatus.UNAUTHORIZED,
    );

    assertHttpError(
      user.isSuspended,
      {
        resultCode: HttpResultStatus.SUSPENDED_ACCOUNT,
        message: "suspended account",
        result: null,
      },
      "suspended account",
      HttpStatus.UNAUTHORIZED,
    );

    return {
      user,
    };
  }
}
