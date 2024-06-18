import { Injectable, Logger } from "@nestjs/common";

import {
  generateHash,
  generateSalt,
  secureCompare,
} from "@thread/shared/password";

import { EnvironmentService } from "../../../integrations/environment/environment.service";
import { LoggerService } from "../../../integrations/logger/logger.service";

@Injectable()
export class PasswordService {
  private _contextName = "password - service";

  constructor(
    private readonly env: EnvironmentService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * @description Hashes a password
   * @param {string} password
   */
  async hash(password: string) {
    const saltOrRound =
      this.env.getPasswordSaltOrRound() || (await generateSalt());
    const hashed = await generateHash(password, saltOrRound);
    return {
      hashed,
      saltOrRound,
    };
  }

  async compare(password: string, hashed: string) {
    try {
      return await secureCompare(password, hashed);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error, error.stack, this._contextName);
      }
      return false;
    }
  }
}
