import { assert } from "console";
import { plainToClass } from "class-transformer";
import { IsNumberString, IsString, validateSync } from "class-validator";

export class EnvironmentVariables {
  // -----------------------------------------------------------------------------
  // app
  // -----------------------------------------------------------------------------
  @IsNumberString()
  PORT: string;

  @IsString()
  DATABASE_URL: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config);

  const errors = validateSync(validatedConfig);
  assert(!errors.length, errors.toString());

  return validatedConfig;
}
