import { Injectable } from "@nestjs/common";

import { EnvironmentService } from "../../../integrations/environment/environment.service";
import { LoggerService } from "../../../integrations/logger/logger.service";

@Injectable()
export class TokenService {
  private _contextName = "token - service";

  constructor(
    private readonly env: EnvironmentService,
    private readonly logger: LoggerService,
  ) {}

  async generateAccessToken(userId: string) {}

  async generateRefreshToken() {}
}
