import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { IntegrationsModule } from "./integrations/integrations.module";
import { AuthModule } from "./routes/auth/auth.module";
import { UsersModule } from "./routes/users/users.module";

@Module({
  imports: [IntegrationsModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
