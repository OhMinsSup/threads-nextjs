import type { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import compression from "compression";
import helmet from "helmet";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      forbidUnknownValues: false,
    }),
  );

  app.setGlobalPrefix("api");
  app.enableVersioning({
    defaultVersion: "1",
    type: VersioningType.URI,
  });

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const allowedHosts = [/^https:\/\/domain.io$/];
      if (config.get("NODE_ENV") === "development") {
        allowedHosts.push(/^http:\/\/localhost/);
      }

      let corsOptions: any;
      const valid = allowedHosts.some((regex) => regex.test(origin));
      if (valid) {
        corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
      } else {
        corsOptions = { origin: false }; // disable CORS for this request
      }
      callback(null, corsOptions);
    },
    credentials: true,
  });

  app.use(helmet());
  app.use(compression());

  await app.listen(config.get("SERVER_PORT"));
}
bootstrap();
