import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { PasswordService } from "./services/password.service";
import { TokenService } from "./services/token.service";

@Module({
  imports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, TokenService],
})
export class AuthModule {}
