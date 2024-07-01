import crypto from "node:crypto";
import utils from "node:util";
import { Injectable } from "@nestjs/common";

import { EnvironmentService } from "../../../integrations/environment/environment.service";
import { LoggerService } from "../../../integrations/logger/logger.service";

const randomBytesPromise = utils.promisify(crypto.randomBytes);
const pbkdf2Promise = utils.promisify(crypto.pbkdf2);

@Injectable()
export class PasswordService {
  private _contextName = "password - service";

  constructor(
    private readonly env: EnvironmentService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * @description Generates a salt
   */
  async createSalt() {
    const buf = await randomBytesPromise(this.env.getSaltRounds(64));
    return buf.toString("base64");
  }

  /**
   * @description Hashes a value
   * @param {string} value
   */
  hash(value: string) {
    return crypto.createHash("sha512").update(value).digest("base64");
  }

  /**
   * @description Hashes a password
   * @param {string} password
   */
  async hashPassword(password: string) {
    const salt = await this.createSalt();
    const key = await pbkdf2Promise(password, salt, 104906, 64, "sha512");
    const hashedPassword = key.toString("base64");

    return {
      salt,
      hashedPassword,
    };
  }

  /**
   * @description Password comparison
   * @param {string} password
   * @param {string} userSalt
   * @param {string} userPassword
   */
  async compare(password: string, userSalt: string, userPassword: string) {
    const key = await pbkdf2Promise(password, userSalt, 104906, 64, "sha512");

    const hashedPassword = key.toString("base64");

    if (hashedPassword === userPassword) {
      return true;
    }

    return false;
  }
}
