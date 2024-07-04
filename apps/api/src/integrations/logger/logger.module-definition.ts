import {
  ConfigurableModuleBuilder,
  FactoryProvider,
  ModuleMetadata,
} from "@nestjs/common";

import { EnvironmentService } from "../environment/environment.service";
import {
  LoggerDriverType,
  LoggerModuleOptions,
} from "./interface/logger.interface";

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<LoggerModuleOptions>({
  moduleName: "LoggerService",
})
  .setClassMethodName("forRoot")
  .build();

export type LoggerModuleAsyncOptions = {
  useFactory: (
    ...args: any[]
  ) => LoggerModuleOptions | Promise<LoggerModuleOptions>;
} & Pick<ModuleMetadata, "imports"> &
  Pick<FactoryProvider, "inject">;

/**
 * Logger Module factory
 * @param environment
 * @returns LoggerModuleOptions
 */
export const loggerModuleFactory = async (
  environmentService: EnvironmentService,
): Promise<LoggerModuleOptions> => {
  const driverType = environmentService.getLoggerDriver();
  const logLevels = environmentService.getLoggerLevel();

  switch (driverType) {
    case LoggerDriverType.Console: {
      return {
        type: LoggerDriverType.Console,
        logLevels: logLevels,
      };
    }
    default:
      throw new Error(
        `Invalid logger driver type (${driverType}), check your .env file`,
      );
  }
};
