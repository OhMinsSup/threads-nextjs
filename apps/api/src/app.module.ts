import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { IntegrationsModule } from "./integrations/integrations.module";
import { AuthModule } from "./routes/auth/auth.module";

@Module({
  imports: [IntegrationsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
