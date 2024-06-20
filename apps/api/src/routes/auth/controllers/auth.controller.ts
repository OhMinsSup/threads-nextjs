import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";

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
    // @Res({ passthrough: true }) res: Response,
  ) {
    // const user = pickUserMe(
    //   await this.authService.signup(body.email, body.password),
    // );
    // // set cookie, passport login
    // await new Promise<void>((resolve, reject) => {
    //   req.login(user, (err) => (err ? reject(err) : resolve()));
    // });
    // return user;
  }
}
