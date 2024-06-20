import { Body, Controller, Post, Res } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";

import { SigninDTO } from "../dto/signin.dto";
import { SignupDTO } from "../dto/signup.dto";
import { AuthService } from "../services/auth.service";

@ApiTags("인증")
@Controller("auth")
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Post("signup")
  @ApiOperation({ summary: "이메일 회원가입" })
  @ApiBody({
    required: true,
    description: "회원가입 API",
    type: SignupDTO,
  })
  async signup(
    @Body() body: SignupDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.service.signup(body);
  }

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Post("signin")
  @ApiOperation({ summary: "이메일 로그인" })
  @ApiBody({
    required: true,
    description: "로그인 API",
    type: SignupDTO,
  })
  async signin(
    @Body() body: SigninDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.service.signin(body);
  }
}
