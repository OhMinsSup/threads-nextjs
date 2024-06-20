import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JsonWebTokenError } from "jsonwebtoken";

import { assert } from "../libs/assert";

@Injectable()
export class JwtAuthGuard extends AuthGuard(["jwt"]) {
  constructor() {
    super();
  }

  handleRequest(err: any, user: any, info: any) {
    console.log("err --->", err);
    console.log("user --->", user);
    console.log("info --->", info);
    assert(user, "", UnauthorizedException);

    if (err) {
      throw err;
    }

    if (info && info instanceof Error) {
      if (info instanceof JsonWebTokenError) {
        info = String(info);
      }

      throw new UnauthorizedException(info);
    }

    return user;
  }
}
