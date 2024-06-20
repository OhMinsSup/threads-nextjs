import type { Request } from "express";
import { HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { assertHttpError } from "src/libs/error";

import type { User } from "@thread/db";
import { HttpResultStatus } from "@thread/enum/result-status";

import { EnvironmentService } from "../../../integrations/environment/environment.service";
import { PrismaService } from "../../../integrations/prisma/prisma.service";
import { UsersService } from "../../../routes/users/services/users.service";

export type JwtPayload = { sub: string; jti?: string };
export type PassportUser = { user?: User };

const defaultCookieTokenName = "thread.access_token";

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
        fromCookie(defaultCookieTokenName),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: env.getAccessTokenSecret(),
    });
  }

  async validate({ sub }: JwtPayload): Promise<PassportUser> {
    console.log("sub --->", sub);

    const user = await this.users.getExternalUserById(sub);

    console.log("user --->", user);

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

    console.log("user --->", user);

    return {
      user,
    };
  }
}
