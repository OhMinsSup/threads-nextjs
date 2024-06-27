import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private _contextName = "middleware - api";

  constructor(private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get("user-agent");

    this.logger.log(
      `[start][${method} - request]${originalUrl} ${ip} ${userAgent}`,
      this._contextName,
    );

    res.on("close", () => {
      const { statusCode } = res;

      const message = `[end][${method} - response]${originalUrl}(${statusCode}) ${ip} ${userAgent}`;

      if (statusCode >= 400) {
        this.logger.error(message, this._contextName);
      } else {
        this.logger.log(message, this._contextName);
      }
    });

    next();
  }
}
