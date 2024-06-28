import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

import { LoggerService } from "../integrations/logger/logger.service";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private _contextName = "middleware - api";

  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get("user-agent");

    this.logger.debug(
      `[start][${method} - request]${originalUrl} ${ip} ${userAgent}`,
      this._contextName,
    );

    res.on("close", () => {
      const { statusCode } = res;

      const message = `[end][${method} - response]${originalUrl}(${statusCode}) ${ip} ${userAgent}`;

      if (statusCode >= 400) {
        this.logger.error(message, this._contextName);
      } else {
        this.logger.debug(message, this._contextName);
      }
    });

    next();
  }
}
