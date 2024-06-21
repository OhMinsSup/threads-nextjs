import { HttpStatus, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JsonWebTokenError } from "jsonwebtoken";
import { assertHttpError } from "src/libs/error";

import { HttpResultStatus } from "@thread/enum/result-status";

@Injectable()
export class JwtAuthGuard extends AuthGuard(["jwt"]) {
  constructor() {
    super();
  }

  handleRequest(err: any, user: any, info: any) {
    assertHttpError(
      !user,
      {
        resultCode: HttpResultStatus.NOT_EXIST,
        message: "Unauthorized",
        result: null,
      },
      "Unauthorized",
      HttpStatus.UNAUTHORIZED,
    );

    if (err) {
      throw err;
    }

    if (info && info instanceof Error) {
      if (info instanceof JsonWebTokenError) {
        info = String(info);
      }

      assertHttpError(
        true,
        {
          resultCode: HttpResultStatus.TOKEN_EXPIRED,
          message: "Unauthorized",
          result: info,
        },
        "Unauthorized",
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
