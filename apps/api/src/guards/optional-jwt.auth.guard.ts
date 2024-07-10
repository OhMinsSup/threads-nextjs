import { applyDecorators, Injectable, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard(["jwt"]) {
  constructor() {
    super();
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || info) return null;

    return user;
  }
}

export function OptionalJwtAuth() {
  return applyDecorators(UseGuards(OptionalJwtAuthGuard));
}
