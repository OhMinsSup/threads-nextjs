import { Global, Module } from "@nestjs/common";

import { EnvironmentModule } from "./environment/environment.module";

@Global()
@Module({
  imports: [EnvironmentModule.forRoot({})],
  exports: [],
  providers: [],
})
export class IntegrationsModule {}
