import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { type User } from "@thread/db";

import { EnvironmentService } from "../../../integrations/environment/environment.service";
import { PrismaService } from "../../../integrations/prisma/prisma.service";

export type JwtPayload = { sub: string; jti?: string };
export type PassportUser = { user?: User };

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private readonly env: EnvironmentService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.getAccessTokenSecret(),
    });
  }
}
