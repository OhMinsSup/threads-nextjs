import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ConfigurableModuleClass } from "./environment.module-definition";
import { EnvironmentService } from "./environment.service";
import { validate } from "./environment.validation";

const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      validate,
    }),
  ],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvironmentModule extends ConfigurableModuleClass {}
