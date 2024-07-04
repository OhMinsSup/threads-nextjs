import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

import { HttpResultStatus } from "@thread/sdk/enum";

import { LoggerService } from "../integrations/logger/logger.service";
import { HttpError, isHttpError } from "../libs/error";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: LoggerService,
  ) {}

  // constructor(private readonly logger: LOgger) {}
  catch(exception: HttpException | HttpError, host: ArgumentsHost) {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    if (isHttpError(exception)) {
      const body = Object.assign({}, responseBody, exception.getData());
      this.logger.error(body.message, exception.stack);
      httpAdapter.reply(ctx.getResponse(), body, status);
      return;
    }

    if (exception instanceof HttpException) {
      const errorResponse = exception.getResponse() as any;
      const error = errorResponse.error;
      const message = errorResponse.message;
      const result = errorResponse.result || null;
      this.logger.error(error, exception.stack);
      const body = Object.assign({}, responseBody, {
        resultCode:
          status === HttpStatus.BAD_REQUEST
            ? HttpResultStatus.INVALID
            : HttpResultStatus.FAIL,
        message,
        error,
        result,
      });
      httpAdapter.reply(ctx.getResponse(), body, status);
      return;
    }

    this.logger.error("알 수 없는 오류가 발생했습니다.", undefined);
    const body = Object.assign({}, responseBody, {
      resultCode: HttpResultStatus.FAIL,
      message: "알 수 없는 오류가 발생했습니다.",
      error: null,
      result: null,
    });
    httpAdapter.reply(ctx.getResponse(), body, status);
  }
}
