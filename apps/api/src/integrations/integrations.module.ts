import { Global, Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";

import { EnvironmentModule } from "./environment/environment.module";
import { EnvironmentService } from "./environment/environment.service";
import { LoggerModule } from "./logger/logger.module";
import { loggerModuleFactory } from "./logger/logger.module-definition";
import { PrismaModule } from "./prisma/prisma.module";

@Global()
@Module({
  imports: [
    EnvironmentModule.forRoot({}),
    LoggerModule.forRootAsync({
      useFactory: loggerModuleFactory,
      inject: [EnvironmentService],
    }),
    ThrottlerModule.forRootAsync({
      inject: [EnvironmentService],
      // @ts-expect-error - ignoreUserAgents is not defined in ThrottlerModuleOptions
      useFactory: async (environmentService: EnvironmentService) => {
        const throttleConfig = environmentService.getThrottleConfig();
        return {
          ttl: throttleConfig.ttl,
          limit: throttleConfig.limit,
          ignoreUserAgents: throttleConfig.ignoreUserAgents,
        };
      },
    }),
    PrismaModule,
  ],
  exports: [],
  providers: [],
})
export class IntegrationsModule {}
