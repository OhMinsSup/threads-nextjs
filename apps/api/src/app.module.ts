import { Logger, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { IntegrationsModule } from "./integrations/integrations.module";
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { AuthModule } from "./routes/auth/auth.module";
import { UsersModule } from "./routes/users/users.module";

@Module({
  imports: [IntegrationsModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
