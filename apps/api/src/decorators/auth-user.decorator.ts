import {
  createParamDecorator,
  ExecutionContext,
  HttpStatus,
} from "@nestjs/common";
import { assertHttpError } from "src/libs/error";

import { HttpResultStatus } from "@thread/enum/result-status";

interface DecoratorOptions {
  allowUndefined?: boolean;
}

export const AuthUser = createParamDecorator(
  (options: DecoratorOptions | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    assertHttpError(
      !options?.allowUndefined && (!request.user || !request.user.user),
      {
        resultCode: HttpResultStatus.LOGIN_REQUIRED,
        message: "이 작업을 수행할 권한이 없습니다.",
        result: null,
      },
      "이 작업을 수행할 권한이 없습니다.",
      HttpStatus.FORBIDDEN,
    );

    return request.user ? request.user.user : undefined;
  },
);
