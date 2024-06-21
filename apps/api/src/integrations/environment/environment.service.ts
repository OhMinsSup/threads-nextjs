import { Injectable, LogLevel } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { addMilliseconds } from "date-fns";
import ms from "ms";

@Injectable()
export class EnvironmentService {
  private _contextName = "environment - config";

  constructor(private configService: ConfigService) {}

  // -----------------------------------------------------------------------------
  // env
  // -----------------------------------------------------------------------------
  getEnv() {
    return this.configService.get<
      "development" | "production" | "test" | "local"
    >("NODE_ENV");
  }

  // -----------------------------------------------------------------------------
  // app
  // -----------------------------------------------------------------------------
  getServerPort(): number {
    const port = this.configService.get<string>("SERVER_PORT");
    return Number(port);
  }

  getDataBaseUrl(): string {
    return this.configService.get<string>("DATABASE_URL");
  }

  // -----------------------------------------------------------------------------
  // security
  // -----------------------------------------------------------------------------
  getPasswordSaltOrRound(): string | undefined {
    return this.configService.get<string | undefined>("PASSWORD_SALT_OR_ROUND");
  }

  getSaltRounds(defaultRound = 64): number {
    const round = this.getPasswordSaltOrRound();
    const saltRounds = round ? Number(round) : defaultRound;
    if (isNaN(saltRounds)) {
      return defaultRound;
    }
    return saltRounds;
  }

  // -----------------------------------------------------------------------------
  // logger
  // -----------------------------------------------------------------------------
  getLoggerDriver(): "console" {
    return this.configService.get<"console">("LOGGER_DRIVER") || "console";
  }

  getLoggerLevel(): LogLevel[] {
    const levels =
      this.configService.get<string>("LOGGER_LEVEL") ||
      "error,warn,log,debug,verbose,fatal";
    return levels.split(",") as LogLevel[];
  }

  // -----------------------------------------------------------------------------
  // token
  // -----------------------------------------------------------------------------
  getAccessTokenExpiresIn(): string {
    return this.configService.get<string>("ACCESS_TOKEN_EXPIRES_IN");
  }

  getAccessTokenExpiresAt() {
    const expiresIn = this.getAccessTokenExpiresIn();
    return addMilliseconds(new Date().getTime(), ms(expiresIn));
  }

  getAccessTokenSecret(): string {
    return this.configService.get<string>("ACCESS_TOKEN_SECRET");
  }

  getAccessTokenName(): string {
    return this.configService.get<string>("ACCESS_TOKEN_NAME");
  }

  getRefreshTokenExpiresIn(): string {
    return this.configService.get<string>("REFRESH_TOKEN_EXPIRES_IN");
  }

  getRefreshTokenExpiresAt() {
    const expiresIn = this.getRefreshTokenExpiresIn();
    return addMilliseconds(new Date().getTime(), ms(expiresIn));
  }

  getRefreshTokenSecret(): string {
    return this.configService.get<string>("REFRESH_TOKEN_SECRET");
  }

  getRefreshTokenName(): string {
    return this.configService.get<string>("REFRESH_TOKEN_NAME");
  }

  // -----------------------------------------------------------------------------
  // throttle
  // -----------------------------------------------------------------------------
  getThrottleConfig() {
    return {
      ttl: 10,
      limit: 60000,
      ignoreUserAgents: [],
    };
  }
}
