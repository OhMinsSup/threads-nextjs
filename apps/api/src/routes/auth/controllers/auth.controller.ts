import { Body, Controller, Patch, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SkipThrottle, Throttle } from "@nestjs/throttler";

import { RefreshTokenDTO } from "../dto/refresh-token.dto";
import { SigninDTO } from "../dto/signin.dto";
import { SignupDTO } from "../dto/signup.dto";
import { VerifyTokenDTO } from "../dto/verify-token.dto";
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
  async signup(@Body() body: SignupDTO) {
    return await this.service.signup(body);
  }

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Post("signin")
  @ApiOperation({ summary: "이메일 로그인" })
  @ApiBody({
    required: true,
    description: "로그인 API",
    type: SigninDTO,
  })
  async signin(@Body() body: SigninDTO) {
    return await this.service.signin(body);
  }

  @SkipThrottle()
  @Post("verify")
  @ApiOperation({ summary: "토큰 검증" })
  @ApiBody({
    required: true,
    description: "토큰 검증 API",
    type: VerifyTokenDTO,
  })
  async verifyToken(@Body() body: VerifyTokenDTO) {
    return await this.service.verifyToken(body);
  }

  @SkipThrottle()
  @Patch("refresh")
  @ApiOperation({ summary: "토큰 갱신" })
  @ApiBody({
    required: true,
    description: "토큰 갱신 API",
    type: RefreshTokenDTO,
  })
  async refresh(@Body() body: RefreshTokenDTO) {
    return await this.service.refresh(body);
  }
}
