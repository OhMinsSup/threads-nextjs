import { Global, Module } from "@nestjs/common";

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
    PrismaModule,
  ],
  exports: [],
  providers: [],
})
export class IntegrationsModule {}
