import { assert } from "console";
import { plainToClass } from "class-transformer";
import {
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  validateSync,
} from "class-validator";

import { IsDuration } from "../../decorators/is-duration.decorator";

export class EnvironmentVariables {
  // -----------------------------------------------------------------------------
  // env
  // -----------------------------------------------------------------------------
  @IsString()
  @IsEnum(["development", "production", "test", "local"])
  NODE_ENV: string;

  // -----------------------------------------------------------------------------
  // app
  // -----------------------------------------------------------------------------
  @IsNumberString()
  SERVER_PORT: string;

  @IsString()
  DATABASE_URL: string;

  // -----------------------------------------------------------------------------
  // security
  // -----------------------------------------------------------------------------
  @IsOptional()
  @IsString()
  PASSWORD_SALT_OR_ROUND: string | undefined;

  // -----------------------------------------------------------------------------
  // logger
  // -----------------------------------------------------------------------------
  @IsString()
  @IsEnum(["console"])
  LOGGER_DRIVER: string;

  // 'log' | 'error' | 'warn' | 'debug' | 'verbose' | 'fatal';
  // ex) 'log,error,warn,debug,verbose,fatal'
  @IsString()
  LOG_LEVELS: string;

  // -----------------------------------------------------------------------------
  // token
  // -----------------------------------------------------------------------------
  @IsString()
  ACCESS_TOKEN_NAME: string;

  @IsString()
  ACCESS_TOKEN_SECRET: string;

  @IsString()
  @IsDuration()
  ACCESS_TOKEN_EXPIRES_IN: string;

  @IsString()
  REFRESH_TOKEN_NAME: string;

  @IsString()
  REFRESH_TOKEN_SECRET: string;

  @IsString()
  @IsDuration()
  REFRESH_TOKEN_EXPIRES_IN: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config);

  const errors = validateSync(validatedConfig);
  assert(!errors.length, errors.toString());

  return validatedConfig;
}
