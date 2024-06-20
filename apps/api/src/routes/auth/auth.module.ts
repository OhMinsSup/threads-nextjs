import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { UsersService } from "../users/services/users.service";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { PasswordService } from "./services/password.service";
import { TokenService } from "./services/token.service";

@Module({
  imports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, TokenService, UsersService],
})
export class AuthModule {}
