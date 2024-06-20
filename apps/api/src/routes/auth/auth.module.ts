import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { EnvironmentService } from "../../integrations/environment/environment.service";
import { UsersService } from "../users/services/users.service";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { PasswordService } from "./services/password.service";
import { TokenService } from "./services/token.service";
import { JwtAuthStrategy } from "./strategies/jwt.auth.strategy";

const jwtModule = JwtModule.registerAsync({
  useFactory: (env: EnvironmentService) => ({
    secret: env.getAccessTokenSecret(),
    signOptions: {
      expiresIn: env.getAccessTokenExpiresIn(),
    },
  }),
  inject: [EnvironmentService],
});

@Module({
  imports: [PassportModule, jwtModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    TokenService,
    UsersService,
    JwtAuthStrategy,
  ],
  exports: [jwtModule],
})
export class AuthModule {}
